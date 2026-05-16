export const checkAssignmentNotifications = (
  assignments
) => {

  const now = new Date();

  assignments.forEach((assignment) => {

    const due = new Date(assignment.dueDate);

    const diff = due - now;

    const oneHour = 60 * 60 * 1000;

    // If assignment due within 1 hour
    if (diff > 0 && diff <= oneHour) {

      // Prevent duplicate alerts
      const alreadyShown = localStorage.getItem(
        `assignment-${assignment._id}`
      );

      if (!alreadyShown) {

        alert(
          `⚠️ Assignment "${assignment.title}" is due within 1 hour!`
        );

        localStorage.setItem(
          `assignment-${assignment._id}`,
          "shown"
        );
      }
    }

  });

};