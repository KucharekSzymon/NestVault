<template>
  <v-container class="front-page pa-10" fluid>
    <v-row>
      <!-- First Column -->
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <h1 class="display-2">Welcome</h1>
          </v-col>
          <v-col cols="12">
            <p>
              Experience luxuries of <b>YOUR</b> minimal setup multi-platform
              file-server app. You can join this <b>{{ getAllUsers }}</b> users
              community that stopped worring about safety of their files. We
              stored <b>{{ getAllFiles }}</b> files already, that are taking a
              total of <b>{{ convertSize(getSpaceUsed) }}</b
              >.
            </p>
            <br />
            <p class="text-medium-emphasis">Tip: {{ randomTip() }}</p>
          </v-col>
        </v-row>
      </v-col>

      <!-- Second Column -->
      <v-col cols="12" md="6">
        <RouterView></RouterView>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import filesService from "../../services/files.service";
import { useToast } from "vue-toastification";

export default {
  name: "HomePage",
  data() {
    return {
      allFiles: null,
      allUsers: null,
      spaceUsed: null,
      success: false,
      loading: false,
      messages: [],
    };
  },
  mounted() {
    this.$watch("messages", () => {
      const toast = useToast();
      if (this.messages) {
        if (Array.isArray(this.messages)) {
          this.messages.forEach((element) => {
            this.success ? toast.success(element) : toast.error(element);
          });
        } else
          this.success
            ? toast.success(this.messages)
            : toast.error(this.messages);
      }
    });
    this.storeUpdate();
  },
  computed: {
    getAllFiles() {
      return this.$store.state.publicStats.allFiles;
    },
    getAllUsers() {
      return this.$store.state.publicStats.allUsers;
    },
    getSpaceUsed() {
      return this.$store.state.publicStats.spaceUsed;
    },
  },
  methods: {
    addErrors(error) {
      this.success = false;
      this.messages = (error.response &&
      error.response.data &&
      Array.isArray(error.response.data.message)
        ? error.response.data.message
        : [error.response.data.message]) || [error.message] || [
          error.toString(),
        ];
    },
    convertSize(size) {
      return filesService.convertSize(size);
    },
    async storeUpdate() {
      this.loading = true;
      await this.$store.dispatch("publicStats/fetchStats");
      this.loading = false;
    },
    randomTip() {
      const tips = [
        "Use asynchronous file operations (such as reading or writing files) to avoid blocking the main thread.",
        "When working with large files, consider streaming data instead of loading the entire file into memory.",
        "Implement file compression techniques, like gzip or deflate, to reduce file sizes and improve network transfer speeds.",
        "Validate file inputs on the server-side to ensure security and prevent malicious file uploads.",
        "Implement file encryption to protect sensitive data stored in files.",
        "Use libraries like Axios or Fetch API to make HTTP requests for file downloads or uploads.",
        "Optimize file loading by combining and minifying JavaScript and CSS files.",
        "Implement lazy loading for images and other media files to improve page load times.",
        "Use Content Delivery Networks (CDNs) to serve static files like images, stylesheets, and scripts for better performance.",
        "Implement file versioning or cache-busting techniques to ensure that users always get the latest file versions.",
        "Implement backup and disaster recovery strategies to protect important files and data.",
        "Regularly clean up unused or outdated files to free up storage space.",
        "Implement file indexing and search functionality for efficient retrieval of specific files.",
        "Use file compression algorithms like zlib to reduce the size of files before storage or transmission.",
        "Implement file chunking and parallel processing for faster file uploads or downloads.",
        "Use HTML5 File API to interact with files on the client-side, such as reading file contents or accessing file metadata.",
        "Implement file type validation to ensure that uploaded files match the expected format.",
        "Implement file access control to restrict unauthorized users from accessing certain files.",
        "Use file hashing algorithms like MD5 or SHA-256 to verify file integrity.",
        "Implement file synchronization techniques to keep files up to date across multiple devices or servers.",
        "Use server-side file caching to improve performance and reduce database load.",
        "Implement file permissions and access levels to control who can read, write, or execute files.",
        "Implement file upload progress indicators to provide feedback to users during lengthy file uploads.",
        "Use cross-browser compatible methods to handle file-related operations.",
        "Implement file download tracking to gather usage analytics and user insights.",
        "Use client-side libraries like Dropzone.js or Fine Uploader for enhanced file upload experiences.",
        "Implement file version control systems (e.g., Git) for managing changes to code files.",
        "Use WebSockets or server-sent events for real-time file updates and notifications.",
        "Implement server-side file validation to check file integrity and prevent tampering.",
        "Consider using a file metadata database to store additional information about files.",
        "Implement file version rollback functionality to revert to previous versions of a file.",
        "Implement file diffing algorithms to track changes between different versions of a file.",
        "Use file system monitoring tools to detect changes made to files in real-time.",
        "Implement file locking mechanisms to prevent concurrent modifications to the same file.",
        "Consider using file deduplication techniques to save storage space by removing duplicate files.",
        "Implement file archiving and compression for long-term storage and efficient retrieval.",
        "Use file event listeners to trigger actions based on file-related events, such as file creation or deletion.",
        "Implement file format conversion capabilities to support compatibility across different file formats.",
        "Consider implementing file sharing and collaboration features to allow multiple users to work on the same file.",
        "Use file virtualization techniques to provide a unified view of files from different storage locations.",
        "Implement file permissions auditing to monitor and track access to sensitive files.",
        "Consider implementing file shredding techniques to securely delete files beyond recovery.",
        "Use file access logging to maintain an audit trail of file access activities for compliance purposes.",
        "Implement file backup verification to ensure the integrity of backed-up files.",
        "Consider implementing file change notification systems to alert users about modifications made to shared files.",
        "Use file transfer protocols like FTP or SFTP for secure and reliable file transfers.",
        "Implement file access restrictions based on user roles and permissions.",
        "Consider implementing file streaming for efficient processing of large files in real-time.",
        "Use file change detection techniques to identify modifications made to files by comparing file signatures or hashes.",
        "Implement file download resuming to allow users to resume interrupted file downloads.",
        "Consider implementing file watermarking techniques to protect against unauthorized use or distribution.",
        "Use file metadata extraction libraries to extract useful information from files, such as EXIF data from images.",
        "Implement file prefetching techniques to proactively load files in anticipation of user actions.",
        "Perform regular maintenance checks on your car, including oil changes, tire rotations, and fluid top-ups.",
        "Keep your tires properly inflated to improve fuel efficiency and extend tire life.",
        "Follow the recommended service schedule provided by the car manufacturer to ensure optimal performance.",
        "Avoid sudden acceleration and harsh braking to improve fuel economy and reduce wear and tear.",
        "Check and replace worn-out brake pads to maintain proper braking efficiency and safety.",
        "Keep a roadside emergency kit in your car, including items like a spare tire, jumper cables, and a flashlight.",
        "Practice defensive driving techniques to anticipate and avoid potential accidents.",
        "Avoid excessive idling to conserve fuel and reduce emissions.",
        "Regularly clean and wax your car to protect the paint and maintain its appearance.",
        "Check your car's air filter and replace it if necessary to ensure good airflow and engine performance.",
        "Avoid carrying unnecessary weight in your car as it can decrease fuel efficiency.",
        "Pay attention to warning lights on your dashboard and address any issues promptly.",
        "Use high-quality fuel and follow the recommended octane rating for your car.",
        "Keep your windshield and other windows clean for clear visibility.",
        "Park your car in shaded areas or use sunshades to protect the interior from sun damage.",
        "Check and replace worn-out windshield wipers for better visibility during rainy conditions.",
        "Avoid aggressive driving behaviors, such as tailgating and weaving through traffic.",
        "Keep a safe following distance to allow for adequate braking time.",
        "Avoid distractions while driving, such as texting or talking on the phone.",
        "Use your turn signals to indicate your intentions and communicate with other drivers.",
        "Adhere to speed limits and adjust your speed according to road and weather conditions.",
        "Ensure that all passengers wear seatbelts for safety.",
        "Avoid driving under the influence of alcohol or drugs.",
        "Check your car's battery regularly and clean the terminals to prevent corrosion.",
        "Maintain proper wheel alignment and have it checked periodically to ensure even tire wear.",
        "Take breaks while playing games to avoid eye strain and fatigue.",
        "Adjust the screen brightness and contrast to optimize visual comfort during gaming sessions.",
        "Use headphones or gaming headsets to enhance the audio experience and immerse yourself in the game.",
        "Experiment with different control schemes to find the one that feels most comfortable and natural for you.",
        "Customize your game settings, such as graphics quality and control sensitivity, to suit your preferences.",
        "Read and familiarize yourself with the game's instructions, controls, and mechanics before diving in.",
        "Explore different game genres and styles to discover new gaming experiences.",
        "Join online gaming communities to connect with other players and gain insights and tips.",
        "Practice good sportsmanship and respectful behavior when playing multiplayer games.",
        "Take the time to explore and interact with the game world to discover hidden secrets and rewards.",
        "Experiment with different character builds or playstyles to keep the gameplay fresh and exciting.",
        "Pay attention to tutorials and hints provided in the game to learn new strategies and mechanics.",
        "Learn from your mistakes and use them as opportunities to improve your skills and strategies.",
        "Take on challenges and difficulties that suit your skill level to maintain a balanced and enjoyable gaming experience.",
        "Consider adjusting the game's difficulty settings to make it more challenging or accessible, depending on your preference.",
        "Backup your game saves and progress regularly to avoid losing hours of gameplay.",
        "Manage your time and prioritize other responsibilities to maintain a healthy balance between gaming and other aspects of life.",
        "Experiment with different gaming platforms and devices to explore a wider variety of games.",
        "Take advantage of in-game tutorials or guides to learn advanced techniques and strategies.",
        "Engage in cooperative gameplay with friends or join multiplayer sessions to foster teamwork and social interaction.",
        "Try playing games from different eras or historical periods to appreciate the evolution of gaming.",
        "Experiment with mods or user-created content to enhance and customize your gaming experience.",
        "Stay updated with game patches and updates to ensure optimal performance and access to new features.",
        "Support game developers by purchasing games from legitimate sources and avoiding piracy.",
        "Read the entire recipe before you start cooking to ensure you have all the ingredients and equipment needed.",
        "Keep your knives sharp for safer and more efficient cutting and chopping.",
        "Clean as you go to maintain an organized and tidy workspace while cooking.",
        "Taste and adjust seasonings as you cook to achieve the desired flavors.",
        "Use fresh, high-quality ingredients for the best taste and nutritional value.",
        "Experiment with different herbs and spices to add depth and complexity to your dishes.",
        "Master basic cooking techniques, such as sautéing, roasting, and braising, to expand your culinary skills.",
        "Don't be afraid to try new recipes or ingredients to broaden your cooking repertoire.",
        "Measure ingredients accurately, especially when baking, to ensure consistent results.",
        "Learn to properly season and balance flavors with salt, acid (such as lemon juice or vinegar), and sweetness.",
        "Preheat your cooking equipment, such as ovens and pans, to ensure even cooking.",
        "Allow meat to rest after cooking to retain its juices and ensure tenderness.",
        "Use a meat thermometer to ensure meats are cooked to the proper internal temperature.",
        "Don't overcrowd the pan when cooking to allow for proper browning and heat distribution.",
        "Learn proper knife skills to improve your efficiency and safety in the kitchen.",
        "Use kitchen timers or smartphone apps to keep track of cooking times and prevent overcooking.",
        "Keep a well-stocked pantry with essential ingredients for quick and convenient meal preparation.",
        "Use the right cooking oil for each recipe, considering smoke point and flavor.",
        "Make your own stocks and broths for flavorful homemade soups, stews, and sauces.",
        "Use a timer or alarm to remind you of time-sensitive cooking tasks, such as boiling eggs or simmering sauces.",
        "Experiment with different cooking methods, such as grilling, steaming, and sous vide, to add variety to your dishes.",
        "Use kitchen scales to accurately measure ingredients, especially for baking.",
        "Invest in quality cookware and utensils that can withstand high temperatures and offer even heat distribution.",
        "Learn to properly season cast iron pans to create a natural non-stick surface.",
        "Always wear a helmet and appropriate protective gear when riding a motorcycle to prioritize your safety.",
        "Keep your motorcycle well-maintained by following the recommended service schedule provided by the manufacturer.",
        "Check your tire pressure regularly and ensure proper tread depth for optimal traction and handling.",
        "Practice smooth throttle control and gradual braking to maintain stability and avoid skidding.",
        "Stay alert and be aware of your surroundings, constantly scanning for potential hazards on the road.",
        "Use hand signals and clear communication to indicate your intentions to other motorists.",
        "Ride defensively and anticipate the actions of other drivers to avoid accidents.",
        "Maintain a safe following distance and avoid tailgating other vehicles.",
        "Take motorcycle safety courses or training programs to enhance your riding skills and knowledge.",
        "Avoid riding in blind spots of larger vehicles, and position yourself for maximum visibility.",
        "Be cautious when riding in inclement weather, as road conditions can become more hazardous.",
        "Check and adjust your mirrors regularly to ensure proper visibility behind you.",
        "Avoid riding when fatigued or under the influence of alcohol or drugs.",
        "Wear bright and reflective clothing to increase your visibility to other drivers.",
        "Observe the speed limits and adjust your speed according to road and traffic conditions.",
        "Practice proper lane positioning to maximize your visibility and maintain a safe space cushion.",
        "Learn to effectively use your motorcycle's brakes, including both the front and rear brakes.",
        "Familiarize yourself with your motorcycle's controls and features before hitting the road.",
        "Be cautious of road hazards such as potholes, debris, and uneven surfaces.",
        "Ride within your skill level and gradually challenge yourself to improve your riding abilities.",
        "Regularly check and maintain your motorcycle's lights, signals, and horn for proper functionality.",
        "Keep a safe distance from parked cars to avoid opening doors or sudden movements.",
        "Avoid weaving through traffic or engaging in risky maneuvers that may compromise your safety.",
        "Ride with a proper seating posture and distribute your weight evenly on the motorcycle.",
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    },
  },
};
</script>
<style scoped></style>
