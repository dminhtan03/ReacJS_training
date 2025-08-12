// // Storage Service
// interface JobFormData {
//   id: string;
//   company: string;
//   position: string;
//   status: string;
//   notes: string;
//   dateAdded: string;
// }
// class JobStorageService {
//   private static STORAGE_KEY = "jobs";

//   static saveJob(job: JobFormData): boolean {
//     try {
//       const existingJobs = JSON.parse(
//         localStorage.getItem(this.STORAGE_KEY) || "[]"
//       );
//       existingJobs.push(job);
//       localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingJobs));

//       console.log("✅ Job saved successfully:", job);
//       return true;
//     } catch (error) {
//       console.error("❌ Error saving job:", error);
//       return false;
//     }
//   }

//   static getAllJobs(): JobFormData[] {
//     try {
//       return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
//     } catch (error) {
//       console.error("❌ Error retrieving jobs:", error);
//       return [];
//     }
//   }

//   static deleteJob(id: string): boolean {
//     try {
//       const existingJobs = JSON.parse(
//         localStorage.getItem(this.STORAGE_KEY) || "[]"
//       );
//       const updatedJobs = existingJobs.filter(
//         (job: JobFormData) => job.id !== id
//       );
//       localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedJobs));

//       console.log("✅ Job deleted successfully:", id);
//       return true;
//     } catch (error) {
//       console.error("❌ Error deleting job:", error);
//       return false;
//     }
//   }

//   static generateId(): string {
//     return Date.now().toString() + Math.random().toString(36).substr(2, 9);
//   }
// }
// export default JobStorageService;
