export default class formValidator {
    static validateTaskInput(task) {
        if (!task) {
            return " Please enter a task";
          }
          if (/^\d/.test(task) || /^[!@#$%^&*(),.?":{}|<>_-]/.test(task)) {
            return " Task cannot start with a number or special character";
          }
          if (task.length < 5) {
            return " Task must be at least 5 characters long";
          }
          return ""; // No errors
        }
}