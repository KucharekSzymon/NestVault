import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { UsersService } from 'src/users/users.service';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<FileDocument>,
    private userService: UsersService,
  ) {}

  async create(data: any) {
    const createdFile = new this.fileModel();
    createdFile.name = data.name;
    createdFile.owner = data.owner;
    createdFile.path = data.path;
    createdFile.type = data.type;
    createdFile.size = data.size;

    await this.userService.uploadOfFile(data.owner, data.size);
    createdFile.save();
    return 'File uploaded';
  }

  async findById(fileId: string) {
    return this.fileModel.findById(fileId);
  }

  async findByOwner(owner: string) {
    return await this.fileModel.find({ owner }).exec();
  }

  async spaceLeft(userId: string) {
    const user = await this.userService.findById(userId);
    return user.storageLimit - user.storedData;
  }

  async findFilesShared(owner: string) {
    const user = await this.userService.findById(owner);
    return await this.fileModel
      .find({ owner: user._id, authorizedUsers: { $ne: [] } })
      .exec();
  }

  async findFilesSharedWithMe(owner: string) {
    const user = await this.userService.findById(owner);
    return await this.fileModel.find({ authorizedUsers: user._id }).exec();
  }

  async checkFile(fileId: string, userId: string) {
    const file = await this.fileModel.findById(fileId);
    const user = await this.userService.findById(userId);

    if (file == null) throw new NotFoundException('File not found.');
    if (user == null) throw new NotFoundException('User not found.');

    if (file.owner._id.toString() === user._id.toString()) return true;
    else if (file.authorizedUsers.includes(user._id)) return true;
    else
      throw new UnauthorizedException('You dont have acces to this resource.');
  }
  async checkFileForOwner(fileId: string, userId: string) {
    const file = await this.fileModel.findById(fileId);
    const user = await this.userService.findById(userId);

    if (file == null) throw new NotFoundException('File not found.');
    if (user == null) throw new NotFoundException('User not found.');

    if (file.owner._id.toString() === user._id.toString()) return true;
    else
      throw new UnauthorizedException(
        'Only owner of file can use this function.',
      );
  }

  async fileShare(fileOwnerId: string, shareToId: string, fileId: string) {
    const file = await this.fileModel.findById(fileId);
    if (await this.checkFileForOwner(fileId, fileOwnerId)) {
      const user = await this.userService.findById(shareToId);
      if (user == null) throw new NotFoundException('User not found.');
      if (file.authorizedUsers.includes(user._id))
        throw new ForbiddenException(
          'This user already have access to this resoure.',
        );
      file.authorizedUsers.push(user);
      await this.fileModel
        .findByIdAndUpdate(fileId, file)
        .setOptions({ overwrite: true, new: true });
      return { message: 'File shared successfully' };
    }
  }
  async fileAccessRevoke(
    fileOwnerId: string,
    shareToId: string,
    fileId: string,
  ) {
    const file = await this.fileModel.findById(fileId);
    if (await this.checkFileForOwner(fileId, fileOwnerId)) {
      const user = await this.userService.findById(shareToId);
      if (user == null) throw new NotFoundException('User not found.');
      if (!file.authorizedUsers.includes(user._id.toString()))
        throw new ForbiddenException(
          'This user does not have acces to this resource.',
        );
      file.authorizedUsers = file.authorizedUsers.filter(
        (obj) => !user._id.equals(obj),
      );

      await this.fileModel
        .findByIdAndUpdate(fileId, file)
        .setOptions({ overwrite: true, new: true });
      return { message: 'File access revoked' };
    }
  }
  async fileAccessRevokeAll(fileOwnerId: string, fileId: string) {
    const file = await this.fileModel.findById(fileId);
    if (await this.checkFileForOwner(fileId, fileOwnerId)) {
      file.authorizedUsers = [];

      await this.fileModel
        .findByIdAndUpdate(fileId, file)
        .setOptions({ overwrite: true, new: true });
      return { message: 'File access revoked for all users' };
    }
  }
  async fileSharedTo(fileOwnerId: string, fileId: string) {
    if (await this.checkFileForOwner(fileId, fileOwnerId)) {
      const file = await this.fileModel
        .findById(fileId)
        .populate('authorizedUsers');
      const users = file.authorizedUsers.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
      }));
      return users;
    }
  }
  async imageStream(fileId: string, userId: string) {
    const file = await this.fileModel.findById(fileId);
    await this.checkFile(fileId, userId);

    return createReadStream(
      join(process.cwd(), 'upload', file.path, file.name),
    );
  }

  async imageBuffer(fileId: string, userId: string) {
    const file = await this.fileModel.findById(fileId);
    await this.checkFile(fileId, userId);

    return readFileSync(join(process.cwd(), 'upload', file.path, file.name));
  }

  async stats(userId: string) {
    const user = await this.userService.findById(userId);
    if (user == null) throw new NotFoundException('User not found');
    const filesShared = await this.findFilesShared(userId);
    const filesSharedWithMe = await this.findFilesSharedWithMe(userId);
    const mine = await this.findByOwner(userId);

    const smallest =
      mine.length != 0
        ? mine.reduce((prev, curr) => (prev.size < curr.size ? prev : curr))
          .size
        : 0;
    const biggest =
      mine.length != 0
        ? mine.reduce((prev, curr) => (prev.size > curr.size ? prev : curr))
          .size
        : 0;
    const data = {
      mine: mine.length,
      shared: filesShared.length,
      sharedWithMe: filesSharedWithMe.length,
      smallest: smallest,
      biggest: biggest,
    };
    return data;
  }

  async adminStats() {
    const allFiles = await this.fileModel.find().exec();
    const users = await this.userService.findAll();
    let spaceUsed = 0;
    let spaceLimit = 0;
    let admins = 0;

    users.forEach((user) => {
      if (user.isAdmin) admins++;
      spaceUsed += user.storedData;
      spaceLimit += user.storageLimit;
    });
    const mostStored = users.reduce((prev, curr) =>
      prev.storedData > curr.storedData ? prev : curr,
    );
    const smallest =
      allFiles.length != 0
        ? allFiles.reduce((prev, curr) => (prev.size < curr.size ? prev : curr))
          .size
        : 0;
    const biggest =
      allFiles.length != 0
        ? allFiles.reduce((prev, curr) => (prev.size > curr.size ? prev : curr))
          .size
        : 0;
    const data = {
      allFiles: allFiles.length,
      allUsers: users.length,
      admins: admins,
      spaceUsed: spaceUsed,
      spaceLimit: spaceLimit,
      smallestFile: smallest,
      biggestFile: biggest,
      hoarder: mostStored.name,
      mostStored: mostStored.storedData,
    };
    return data;
  }

  async publicStats() {
    const allFiles = await this.fileModel.find().exec();
    const users = await this.userService.findAll();
    let spaceUsed = 0;

    users.forEach((user) => {
      spaceUsed += user.storedData;
    });

    const data = {
      allFiles: allFiles.length,
      allUsers: users.length,
      spaceUsed: spaceUsed,
    };
    return data;
  }

  async remove(fileId: string, reqId: string) {
    const file = await this.fileModel.findById(fileId);

    if (await this.checkFileForOwner(fileId, reqId)) {
      this.userService.removalOfFile(reqId, file.size);
      this.deleteFile(`./upload/${file.path}/${file.name}`);
      this.fileModel.findByIdAndDelete(fileId).exec();
      return { message: 'File deleted successfully' };
    }
  }
  deleteFile(filePath: string): void {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.log(error);
    }
  }
  randomTip() {
    const tips =
    {
      "File Management": [
        "Organize your files into folders and use descriptive file names to easily locate and manage your data.",
        "Regularly declutter your computer by deleting unnecessary files to improve system performance.",
        "Organize your files into logical categories and subfolders to save time when searching for specific files.",
        "Regularly archive and compress old files to free up storage space and improve overall system performance.",
        "Create shortcuts or aliases for frequently accessed files or folders to save time and effort.",
        "Use file compression formats like ZIP or RAR to significantly reduce file size and make sharing easier.",
        "Regularly perform disk cleanup to remove temporary files and free up disk space.",
        "Use file compression software to create compressed archives for efficient storage and sharing.",
        "Implement file versioning to track and manage different versions of your files.",
        "Rename files in a consistent and descriptive manner to maintain organization.",
        "Create a file backup schedule and automate the process for convenience.",
        "Utilize file syncing services to keep your files up to date across multiple devices.",
        "Implement file access permissions to restrict unauthorized access to sensitive files.",
        "Utilize cloud storage solutions to store and access files from anywhere.",
        "Regularly scan your files for malware and remove any infected ones.",
        "Consider using file encryption software to protect confidential files."

      ],
      "Data Management": [
        "Implement data classification to categorize and prioritize your data based on its sensitivity.",
        "Regularly audit your data to identify outdated or redundant information.",
        "Implement data anonymization techniques to protect the privacy of individuals.",
        "Create a data retention policy to define how long data should be stored and when it should be deleted.",
        "Use data profiling tools to analyze and understand the structure and quality of your data.",
        "Implement data masking techniques to obfuscate sensitive information in non-production environments.",
        "Implement data governance practices to ensure data is managed effectively and compliantly.",
        "Utilize data visualization tools to gain insights and communicate data effectively.",
        "Regularly validate and cleanse your data to maintain its accuracy and integrity.",
        "Implement data replication strategies to ensure high availability and disaster recovery.",
        "Regularly back up your data to prevent loss in case of hardware failure or accidental deletion.",
        "Encrypt sensitive data before storing or transmitting it to add an extra layer of protection against unauthorized access.",
        "Implement data deduplication techniques to optimize storage space and reduce data redundancy.",
        "Implement data validation and sanitization techniques to ensure the integrity and quality of your data.",
        "Use data profiling techniques to gain insights into the structure and quality of your data.",
        "Regularly update and patch your database management system to fix security vulnerabilities and improve performance."
      ],
      "Security": [
        "Regularly review and update your firewall rules to block unauthorized network access.",
        "Enable automatic software updates to ensure you have the latest security patches.",
        "Implement network segmentation to isolate critical systems and reduce the attack surface.",
        "Utilize a password manager to securely store and generate strong passwords.",
        "Conduct regular security awareness training for employees to educate them about potential threats.",
        "Implement intrusion detection and prevention systems to detect and block suspicious activities.",
        "Regularly conduct vulnerability assessments and penetration testing to identify security weaknesses.",
        "Implement file integrity monitoring to detect unauthorized changes to important files.",
        "Enable logging and monitoring of security events to quickly identify and respond to security incidents.",
        "Implement a comprehensive incident response plan to effectively handle and mitigate security breaches.",
        "Use strong, unique passwords for each online account to greatly enhance your digital security.",
        "Enable two-factor authentication to add an extra layer of security to your online accounts.",
        "Keep your operating system and software up to date to ensure you have the latest security patches and bug fixes.",
        "Regularly scan your computer for malware and viruses to keep your system secure.",
        "Avoid clicking on suspicious links or downloading files from unknown sources to minimize the risk of malware infections.",
        "Implement a firewall and configure proper network security settings to protect your computer from unauthorized access.",
        "Avoid using public Wi-Fi networks for sensitive online activities to prevent potential data interception.",
        "Regularly review your privacy settings on social media platforms to protect your personal information.",
        "Encrypt your internet traffic with a virtual private network (VPN) to add an extra layer of privacy and security."
      ],
      "Web Technologies": [
        "Optimize your website's images by using the appropriate image formats and compressing them.",
        "Implement content caching to improve website performance and reduce server load.",
        "Regularly test your website's performance and optimize bottlenecks for faster loading times.",
        "Implement cross-browser compatibility testing to ensure your website works well across different web browsers.",
        "Utilize responsive email design techniques to ensure your emails are well-rendered on various devices.",
        "Implement user-friendly error handling to provide meaningful error messages to website visitors.",
        "Use structured data markup to enhance search engine visibility and improve SEO.",
        "Regularly update and patch your website's content management system and plugins for security.",
        "Implement secure communication protocols (HTTPS) to encrypt data transmitted between your website and users.",
        "Conduct regular website security audits to identify and fix vulnerabilities.",
        "Implement responsive web design to ensure your website looks great and functions well across different devices.",
        "Use version control systems like Git to track changes in your web development projects and facilitate collaboration.",
        "Using caching techniques like browser caching and CDNs can significantly improve website loading speed.",
        "Implement responsive images with appropriate sizes and formats to enhance page load times on mobile devices.",
        "Implement lazy loading for images and videos to improve initial page load times and save bandwidth.",
        "Optimize your website's performance by minifying CSS and JavaScript files to improve page load times.",
        "Implement SEO best practices to improve your website's visibility and attract more organic traffic.",
        "Using a content delivery network (CDN) can distribute your website's content globally, improving its speed and availability.",
        "Implement structured data markup on your website to enhance search engine visibility and result in rich snippets."
      ],
      "Cars": [
        "Check your car's battery regularly and clean the terminals to ensure proper electrical connections.",
        "Inspect and replace worn-out windshield wipers to maintain clear visibility during inclement weather.",
        "Keep a spare tire, jack, and lug wrench in your car for emergencies.",
        "Regularly check and maintain the proper fluid levels in your car, including oil, coolant, and transmission fluid.",
        "Pay attention to warning lights on your car's dashboard and address any issues promptly.",
        "Follow the recommended tire rotation schedule to promote even tire wear and extend their lifespan.",
        "Use a sunshade to protect your car's interior from harmful UV rays and reduce heat buildup.",
        "Keep your car's exterior paint protected by waxing it regularly.",
        "Avoid revving the engine excessively during cold starts to prevent unnecessary strain.",
        "Check your car's owner's manual for the recommended tire pressure and adjust accordingly.",
        "When parking, turn your wheels towards the curb to prevent your car from rolling downhill.",
        "Avoid abrupt or aggressive steering maneuvers to maintain control and stability.",
        "Regularly inspect and replace worn-out spark plugs to ensure efficient combustion.",
        "Clean and condition your car's leather seats to keep them supple and prevent cracking.",
        "Check and replace faulty or dimming headlights to maintain optimal visibility at night.",
        "Avoid idling your car for extended periods to conserve fuel and reduce emissions.",
        "Keep your car's trunk organized with essentials like a first aid kit, jumper cables, and emergency supplies.",
        "Regularly clean your car's air filter or replace it if necessary to maintain good air flow.",
        "Practice smooth acceleration and deceleration to maximize fuel efficiency.",
        "Avoid aggressive braking by maintaining a safe following distance and anticipating traffic flow.",
        "Check and maintain the proper alignment of your car's wheels to ensure even tire wear and optimal handling.",
        "Regularly check your tire pressure to ensure optimal fuel efficiency and tire performance.",
        "Follow the recommended maintenance schedule for your car to keep it running smoothly.",
        "Check your engine oil level regularly and change it as per the manufacturer's recommendations.",
        "Maintain a safe following distance to allow for adequate braking and response time.",
        "Avoid sudden acceleration and braking to conserve fuel and reduce wear on your car's components.",
        "Keep your car's exterior clean and protected to prevent paint damage and rust.",
        "Check and replace your car's air filter as necessary to maintain good air flow and engine performance.",
        "Always use the appropriate fuel type recommended by the car manufacturer.",
        "Inspect and replace worn-out brake pads to ensure optimal braking performance.",
        "Keep a basic car emergency kit in your vehicle, including items like a spare tire, jumper cables, and a flashlight.",
        "Avoid overloading your car with excess weight, as it can negatively impact fuel efficiency and handling.",
        "Regularly inspect and clean your car's battery terminals to prevent corrosion.",
        "Use sunshades or park in shaded areas to protect your car's interior from sun damage and overheating.",
        "Check and replace windshield wiper blades as needed to maintain clear visibility during rainy conditions.",
        "Avoid aggressive driving behaviors, such as rapid acceleration and harsh braking, to prolong the life of your car's components.",
        "Park your car in a garage or covered area to protect it from the elements and reduce the risk of theft or vandalism.",
        "Check and top up all fluid levels in your car, including coolant, brake fluid, and power steering fluid.",
        "Regularly inspect and maintain your car's suspension system for a smooth and comfortable ride.",
        "Keep your car's headlights clean and aligned properly for optimal visibility at night.",
        "Practice defensive driving techniques to anticipate and respond to potential hazards on the road."
      ],
      "Motorcycles": [
        "Maintain a firm grip on the handlebars and use smooth, controlled movements when steering.",
        "Check your motorcycle's headlights, taillights, and turn signals regularly to ensure they are working properly.",
        "Practice proper body positioning and weight distribution to maintain stability and control while riding.",
        "Avoid riding in inclement weather conditions, such as heavy rain or strong winds, whenever possible.",
        "Check your motorcycle's engine oil level regularly and change it according to the manufacturer's recommendations.",
        "Inspect and replace worn-out brake pads or shoes to ensure effective braking performance.",
        "Stay vigilant and constantly scan the road ahead for potential hazards, including debris, potholes, and animals.",
        "Keep a safe distance from other vehicles on the road, especially large trucks and buses.",
        "Avoid tailgating other vehicles to allow for adequate reaction time and space in case of sudden stops.",
        "Take a motorcycle safety course to improve your riding skills and knowledge of road safety.",
        "Be mindful of your motorcycle's fuel range and plan your refueling stops accordingly.",
        "Check and adjust your motorcycle's suspension settings to match your riding style and road conditions.",
        "Use your motorcycle's horn as a means of communication and to alert others of your presence when necessary.",
        "When riding in a group, maintain proper spacing and use hand signals or communication devices to coordinate actions.",
        "Avoid riding during peak traffic hours whenever possible to reduce the risk of accidents and congestion.",
        "Before each ride, visually inspect your motorcycle for any signs of damage or loose components.",
        "Be aware of blind spots and avoid lingering in them when riding near other vehicles.",
        "Maintain a relaxed and comfortable riding posture to reduce fatigue and enhance control.",
        "Consider installing additional safety features on your motorcycle, such as ABS (anti-lock braking system) or traction control.",
        "Stay up-to-date on local traffic laws and regulations specific to motorcycles in your area.",
        "Always wear appropriate safety gear, including a helmet, gloves, boots, and protective clothing.",
        "Check your motorcycle's tire pressure regularly and adjust as needed for optimal performance and safety.",
        "Keep your motorcycle's chain clean and lubricated to prevent wear and improve performance.",
        "Follow the recommended maintenance schedule for your motorcycle to keep it running smoothly.",
        "Always use the appropriate fuel type recommended by the motorcycle manufacturer.",
        "Check and adjust your motorcycle's brakes regularly to ensure optimal stopping power.",
        "Avoid sudden acceleration and braking to prevent skidding or loss of control.",
        "Keep your motorcycle's mirrors clean and adjusted properly for optimal visibility.",
        "Always signal your turns and lane changes to communicate your intentions to other drivers.",
        "Practice defensive driving techniques to anticipate and respond to potential hazards on the road.",
        "Avoid riding in a vehicle's blind spot, and position yourself in a visible spot in traffic.",
        "Ride at a safe and appropriate speed for the road conditions and your level of experience.",
        "Keep a safe following distance to allow for adequate braking and response time.",
        "Avoid riding when you are fatigued or under the influence of drugs or alcohol.",
        "Practice emergency stopping maneuvers in a controlled environment to prepare for unexpected situations on the road.",
        "Use your horn and headlights to alert other drivers of your presence and intentions.",
        "Avoid riding between lanes of traffic, also known as lane splitting, as it can be dangerous and illegal in some areas.",
        "Keep a first aid kit and basic tools in your motorcycle's storage compartment in case of emergencies.",
        "Ride with a passenger only if your motorcycle is designed and equipped to do so safely.",
        "Check and maintain the proper tension on your motorcycle's drive belt or chain for optimal performance."
      ],
      "Personal Time Management": [
        "Set clear goals and prioritize your tasks based on their importance and deadlines.",
        "Break down large tasks into smaller, more manageable steps to make them less overwhelming.",
        "Create a daily or weekly schedule to allocate specific time slots for different activities and tasks.",
        "Avoid multitasking and focus on one task at a time to improve productivity and efficiency.",
        "Identify and eliminate or delegate tasks that are not essential or do not align with your goals.",
        "Take regular breaks to recharge and maintain your energy levels throughout the day.",
        "Learn to say 'no' to requests and commitments that do not align with your priorities.",
        "Utilize productivity tools, such as to-do lists, calendars, or task management apps, to stay organized.",
        "Practice effective communication to minimize misunderstandings and save time.",
        "Set realistic deadlines for yourself and avoid procrastination by breaking tasks into smaller, actionable steps.",
        "Learn to delegate tasks to others when appropriate and trust them to deliver results.",
        "Manage distractions by turning off notifications, closing unnecessary tabs or apps, and creating a focused work environment.",
        "Prioritize self-care activities, such as exercise, sleep, and relaxation, to maintain overall well-being.",
        "Review and evaluate your progress regularly to identify areas for improvement and adjust your strategies as needed.",
        "Group similar tasks together to streamline your workflow and minimize transition time between different activities.",
        "Practice effective time estimation to allocate the right amount of time for each task.",
        "Learn and utilize time-saving techniques, such as batch processing, automation, or shortcuts.",
        "Take advantage of idle or waiting time by carrying a book, listening to educational podcasts, or practicing mindfulness.",
        "Delegate or outsource tasks that are outside your expertise or take up too much of your time.",
        "Regularly assess your priorities and make adjustments based on changing circumstances and goals."
      ],
      "Business": [
        "Define a clear vision and mission for your business to guide your decisions and actions.",
        "Research and understand your target market to tailor your products or services to their needs.",
        "Develop a comprehensive business plan that outlines your goals, strategies, and financial projections.",
        "Build a strong and diverse team with complementary skills and expertise.",
        "Establish effective communication channels within your organization to foster collaboration and transparency.",
        "Regularly review and analyze your financial statements to track your business's performance and make informed decisions.",
        "Invest in marketing and advertising strategies to promote your business and attract customers.",
        "Build and maintain strong relationships with customers by providing excellent products, services, and support.",
        "Stay updated on industry trends and technological advancements to remain competitive.",
        "Continuously seek feedback from customers, employees, and stakeholders to improve your products or services.",
        "Monitor and adapt to changes in the market, including consumer preferences, regulations, and competitive landscape.",
        "Manage your cash flow effectively by monitoring expenses, invoicing promptly, and controlling inventory.",
        "Invest in your employees' professional development and provide opportunities for growth.",
        "Embrace innovation and encourage creativity within your organization to drive continuous improvement.",
        "Network and build connections with other professionals and industry leaders to expand your reach and knowledge.",
        "Stay compliant with relevant laws, regulations, and industry standards to avoid legal issues and reputational damage.",
        "Build a strong online presence through a professional website, social media, and online marketing channels.",
        "Monitor and manage your business's online reputation by actively engaging with customers and addressing feedback.",
        "Stay customer-centric by anticipating their needs, providing personalized experiences, and seeking customer loyalty.",
        "Invest in robust cybersecurity measures to protect your business and customer data from cyber threats."
      ],
      "Cooking": [
        "Read and understand the recipe thoroughly before starting to cook.",
        "Prep and organize all the ingredients and utensils before you begin cooking.",
        "Keep your knives sharp for safer and more efficient cutting.",
        "Taste and adjust seasonings as you cook to achieve the desired flavor.",
        "Use fresh, high-quality ingredients for better taste and nutritional value.",
        "Learn and practice basic knife skills for efficient and precise chopping.",
        "Don't overcrowd the pan when sautéing or frying to ensure proper browning.",
        "Use a meat thermometer to check the doneness of meats and avoid overcooking.",
        "Let meat rest for a few minutes before slicing to retain its juices.",
        "Use different cooking methods such as roasting, grilling, and steaming to add variety to your dishes.",
        "Keep a kitchen timer or use a timer app to avoid overcooking or burning your food.",
        "Properly measure ingredients using measuring cups and spoons for accurate results.",
        "Follow baking recipes precisely, as baking is a science that requires precise measurements and ratios.",
        "Use cooking oils with high smoke points for frying and sautéing to prevent them from breaking down and creating smoke.",
        "Clean as you go to maintain a tidy and organized workspace during cooking.",
        "Don't be afraid to experiment with flavors and ingredients to create your unique dishes.",
        "Use herbs and spices to enhance the taste of your dishes and add depth of flavor.",
        "Master a few basic cooking techniques, such as sautéing, boiling, and roasting, to expand your culinary repertoire.",
        "Practice food safety by storing perishable items properly, cooking meats to the appropriate internal temperature, and avoiding cross-contamination.",
        "Invest in quality cookware and utensils that will last long and provide even heat distribution.",
        "Have fun and enjoy the process of cooking, and don't be discouraged by occasional mistakes or failures."
      ],
      "Health": [
        "Maintain a balanced diet with a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats.",
        "Stay hydrated by drinking an adequate amount of water throughout the day.",
        "Engage in regular physical activity to improve cardiovascular health, strength, and flexibility.",
        "Get enough sleep each night to allow your body to rest and recharge.",
        "Practice good hygiene, including regular handwashing, to prevent the spread of germs.",
        "Manage stress through techniques such as exercise, meditation, deep breathing, or engaging in hobbies.",
        "Limit the consumption of processed foods, sugary drinks, and excessive salt and sugar.",
        "Quit smoking and avoid exposure to secondhand smoke to reduce the risk of respiratory and cardiovascular diseases.",
        "Protect your skin from sun damage by using sunscreen, wearing protective clothing, and seeking shade.",
        "Schedule regular check-ups and screenings with your healthcare provider for preventive care.",
        "Maintain a healthy weight by balancing calorie intake and physical activity.",
        "Limit alcohol consumption to moderate levels, if you choose to drink.",
        "Practice safe sex by using protection and getting regular screenings for sexually transmitted infections.",
        "Take breaks and practice proper ergonomics when working at a desk or using electronic devices.",
        "Engage in activities that promote mental well-being, such as spending time with loved ones, pursuing hobbies, or practicing mindfulness.",
        "Stay socially connected with friends and family to foster a sense of belonging and support.",
        "Avoid prolonged sitting or sedentary behavior by incorporating movement and regular breaks throughout the day.",
        "Practice proper hand hygiene and respiratory etiquette to prevent the spread of infectious diseases.",
        "Prioritize self-care and make time for activities that bring you joy and relaxation.",
        "Listen to your body's signals and take rest when needed to prevent overexertion and burnout.",
        "Stay informed about health-related topics through reputable sources and consult healthcare professionals for personalized advice."
      ],
      "Lifestyle": [
        "Practice good time management to balance work, personal life, and leisure activities.",
        "Set realistic goals and break them down into actionable steps for better productivity and achievement.",
        "Prioritize self-care activities, such as exercise, relaxation, and hobbies, to maintain physical and mental well-being.",
        "Spend quality time with loved ones and nurture meaningful relationships.",
        "Practice gratitude and mindfulness to enhance overall happiness and well-being.",
        "Limit screen time and create boundaries to maintain a healthy balance with technology.",
        "Declutter and organize your living space to create a more peaceful and efficient environment.",
        "Explore new hobbies and interests to foster personal growth and creativity.",
        "Manage your finances by budgeting, saving, and planning for the future.",
        "Embrace a minimalist lifestyle by focusing on experiences and meaningful possessions rather than materialistic accumulation.",
        "Practice eco-friendly habits, such as recycling, reducing waste, and conserving energy.",
        "Engage in regular physical activity that you enjoy to promote overall fitness and vitality.",
        "Cultivate a positive mindset and practice self-compassion to enhance mental well-being.",
        "Find a healthy work-life balance that allows you to prioritize personal time and relaxation.",
        "Explore different forms of relaxation and stress reduction techniques, such as meditation, yoga, or deep breathing exercises.",
        "Nurture your creativity by engaging in activities like painting, writing, or playing a musical instrument.",
        "Stay curious and continue learning through reading, taking courses, or attending workshops.",
        "Take breaks from digital devices and spend time outdoors in nature for mental and physical rejuvenation.",
        "Practice good sleep hygiene by establishing a regular sleep schedule and creating a relaxing bedtime routine.",
        "Practice effective communication and active listening in your relationships to foster understanding and connection.",
        "Travel and explore new places to broaden your perspective and gain new experiences.",
        "Find a healthy balance between work, leisure, and rest to prevent burnout and maintain overall well-being."
      ],
      "Phones": [
        "Regularly update your phone's operating system to ensure you have the latest features and security patches.",
        "Protect your phone with a strong passcode or biometric authentication (such as fingerprint or face recognition).",
        "Install reputable antivirus software to safeguard your phone from malware and viruses.",
        "Backup your important data regularly to prevent data loss in case of accidents or device failure.",
        "Manage your phone's storage by deleting unnecessary files, clearing caches, and offloading unused apps.",
        "Optimize your phone's battery life by adjusting screen brightness, disabling unnecessary background processes, and closing unused apps.",
        "Use secure and trusted app stores to download and install applications.",
        "Be cautious when clicking on links or downloading attachments from unknown or suspicious sources.",
        "Enable two-factor authentication for your important accounts to add an extra layer of security.",
        "Keep your phone's Bluetooth and Wi-Fi turned off when not in use to prevent unauthorized access.",
        "Configure privacy settings to control the permissions granted to apps and ensure your personal data is protected.",
        "Avoid using public Wi-Fi networks for sensitive activities like banking or accessing confidential information.",
        "Clean your phone's screen regularly to remove smudges and dirt using a soft, lint-free cloth.",
        "Avoid exposing your phone to extreme temperatures, direct sunlight, or moisture.",
        "Use a screen protector and a protective case to safeguard your phone from scratches, drops, and impacts.",
        "Regularly review and update your installed apps to remove any outdated or unused ones.",
        "Be mindful of your phone usage and practice healthy habits, such as taking breaks, setting boundaries, and prioritizing face-to-face interactions.",
        "Securely erase data from your phone before selling, donating, or recycling it to protect your personal information.",
        "Keep your phone's contacts and important information backed up in a secure location.",
        "Familiarize yourself with your phone's features and settings to make the most of its capabilities.",
        "Install a password manager to securely store and manage your passwords for different accounts."
      ],
      "Music": [
        "Explore different genres of music to expand your musical horizons and discover new artists.",
        "Create personalized playlists for different moods, occasions, or activities.",
        "Support your favorite artists by purchasing their music or merchandise.",
        "Attend live music concerts or festivals to experience the energy and excitement of live performances.",
        "Learn to play a musical instrument to express yourself creatively and deepen your appreciation for music.",
        "Discover and follow music blogs, magazines, or online communities to stay up to date with the latest music trends and releases.",
        "Utilize music streaming platforms to discover new songs and artists tailored to your preferences.",
        "Experiment with music production software or apps to create your own music or remixes.",
        "Listen to music mindfully and create dedicated listening sessions to fully immerse yourself in the music.",
        "Support local music scenes and independent artists by attending local gigs or purchasing their music.",
        "Join a choir, band, or music group to collaborate with other musicians and enhance your musical skills.",
        "Explore music from different cultures and regions to gain a deeper understanding of global musical traditions.",
        "Use music as a form of relaxation or stress relief by creating soothing playlists or engaging in music therapy.",
        "Learn about the history and evolution of different music genres to develop a comprehensive knowledge of music.",
        "Share your favorite music with friends and family to create connections and discover new musical interests.",
        "Engage with music critics or reviews to gain insights into the artistic and technical aspects of music.",
        "Take music lessons or enroll in music classes to improve your musical skills and knowledge.",
        "Experiment with different music streaming platforms to find the one that best suits your preferences and needs.",
        "Explore the lyrics and meanings behind your favorite songs to deepen your connection with the music.",
        "Support local music stores or independent record shops to discover physical copies of music albums.",
        "Create a music journal or diary to document your thoughts and reflections on different songs or albums."
      ]
    }
    const categories = Object.keys(tips);

    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const tipsArray = tips[randomCategory];

    const randomTip = tipsArray[Math.floor(Math.random() * tipsArray.length)];

    return {
      "category": randomCategory,
      "tip": randomTip
    };

  }
}
