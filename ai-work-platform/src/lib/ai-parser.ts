import { generateId } from "./utils";
import { addDays, startOfToday } from "date-fns";
import { Task } from "./types";

/**
 * Mock AI Parser that converts unstructured text into structured tasks.
 */
export function parseTextToTasks(text: string, currentUser: string, workspaceId: string): Task[] {
  const tasks: Task[] = [];
  
  // Split into sentences for rudimentary NLP
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];

  sentences.forEach((sentence) => {
    const s = sentence.toLowerCase();
    
    // Skip completely empty or tiny sentences
    if (s.trim().length < 10) return;

    // Default defaults
    let owner = currentUser;
    let priority: Task["priority"] = "Later";
    let category: Task["category"] = "Work";
    let deadline = addDays(startOfToday(), 1); // Default tomorrow
    let effort: Task["effort"] = "Medium";

    // 1. Detect Names (Owner)
    if (s.includes("ravi")) owner = "Ravi";
    else if (s.includes("priya")) owner = "Priya";
    else if (s.includes("alex")) owner = "Alex";
    else if (s.includes("jordan")) owner = "Jordan";
    else if (s.includes("team")) owner = "Team";

    // 2. Detect Deadlines
    if (s.includes("today")) deadline = startOfToday();
    else if (s.includes("tomorrow")) deadline = addDays(startOfToday(), 1);
    else if (s.includes("friday")) deadline = addDays(startOfToday(), (5 - startOfToday().getDay() + 7) % 7 || 7);
    else if (s.includes("next week")) deadline = addDays(startOfToday(), 7);

    // 3. Detect Priority/Category/Effort based on keywords
    if (s.includes("review")) {
      priority = "Important";
      category = "Review";
    }
    if (s.includes("follow up") || s.includes("follow-up")) {
      priority = "Important";
      category = "Follow-up";
      effort = "Low";
    }
    if (s.includes("send")) {
      priority = "Important";
      category = "Work";
      effort = "Low";
    }
    if (s.includes("urgent") || s.includes("asap") || s.includes("needs attention")) {
      priority = "Urgent";
    }
    if (s.includes("maybe") || s.includes("optional")) {
      priority = "Optional";
      effort = "Low";
    }

    // Clean title - extract a reasonable chunk
    let title = sentence.trim();
    if (title.length > 50) title = title.substring(0, 47) + "...";
    // capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);

    tasks.push({
      id: generateId(),
      title,
      description: `Generated from context: "${sentence.trim()}"`,
      owner,
      assignedBy: currentUser,
      deadline: deadline.toISOString(),
      priority,
      category,
      effort,
      status: "Pending",
      workspaceId,
      comments: [],
      ccList: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  return tasks;
}
