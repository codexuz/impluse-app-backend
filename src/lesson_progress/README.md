# Lesson Progress Statistics API

This module provides comprehensive statistics for student progress tracking across different sections (reading, listening, grammar, writing, speaking).

## Available Statistics Endpoints

### Basic Progress Endpoints

1. **GET** `/lesson-progress/stats/section-progress`
   - Returns overall section progress statistics for all students
   - Shows completed/total counts and percentages for each section

2. **GET** `/lesson-progress/stats/student/:studentId/sections`
   - Returns section progress statistics for a specific student
   - Shows how many lessons the student has completed in each section

3. **GET** `/lesson-progress/stats/lesson/:lessonId/sections`
   - Returns section progress statistics for a specific lesson
   - Shows how many students have completed each section of the lesson

4. **GET** `/lesson-progress/stats/average-progress`
   - Returns average progress percentages across all sections
   - Includes overall average across all sections

### Advanced Statistics Endpoints

5. **GET** `/lesson-progress/stats/top-performers/:section?limit=10`
   - Returns top performing students for a specific section
   - Query parameter `limit` controls how many top students to return
   - Supports sections: reading, listening, grammar, writing, speaking

6. **GET** `/lesson-progress/stats/comprehensive-report`
   - Returns a complete statistical overview including:
     - Overall statistics (total students, lessons, average completion)
     - Section averages
     - Completion distribution (0-20%, 21-40%, etc.)
     - Top performers for each section

7. **POST** `/lesson-progress/stats/compare-students`
   - Compare progress between multiple students
   - Request body: `{ "student_ids": ["uuid1", "uuid2", ...] }`
   - Returns individual stats for each student plus group averages

8. **GET** `/lesson-progress/stats/trends?days=30`
   - Returns progress trends over time
   - Query parameter `days` controls the time period (default: 30 days)
   - Shows daily progress and section-specific trends

## Response Examples

### Section Progress Stats
```json
{
  "reading": { "completed": 45, "total": 100, "percentage": 45.0 },
  "listening": { "completed": 38, "total": 100, "percentage": 38.0 },
  "grammar": { "completed": 52, "total": 100, "percentage": 52.0 },
  "writing": { "completed": 29, "total": 100, "percentage": 29.0 },
  "speaking": { "completed": 33, "total": 100, "percentage": 33.0 }
}
```

### Average Section Progress
```json
{
  "reading": 45.0,
  "listening": 38.0,
  "grammar": 52.0,
  "writing": 29.0,
  "speaking": 33.0,
  "overall": 39.4
}
```

### Top Performers by Section
```json
{
  "section": "reading",
  "students": [
    {
      "student_id": "uuid1",
      "completed_lessons": 18,
      "total_lessons": 20,
      "completion_rate": 90.0
    },
    {
      "student_id": "uuid2",
      "completed_lessons": 17,
      "total_lessons": 20,
      "completion_rate": 85.0
    }
  ]
}
```

### Student Comparison
```json
{
  "students": [
    {
      "student_id": "uuid1",
      "reading_progress": 90.0,
      "listening_progress": 85.0,
      "grammar_progress": 95.0,
      "writing_progress": 75.0,
      "speaking_progress": 80.0,
      "overall_progress": 85.0,
      "completed_lessons": 17,
      "total_lessons": 20
    }
  ],
  "group_averages": {
    "reading": 72.5,
    "listening": 68.0,
    "grammar": 78.5,
    "writing": 61.0,
    "speaking": 65.5,
    "overall": 69.1
  }
}
```

## Integration with Homework Submissions

The lesson progress system automatically updates when:
- A homework submission is marked as "passed"
- A student completes a section of homework
- The `saveBySection` method is called in homework submissions

## Section Types

The system tracks progress for these sections:
- **reading**: Reading comprehension exercises
- **listening**: Audio comprehension exercises  
- **grammar**: Grammar practice exercises
- **writing**: Writing assignments
- **speaking**: Speaking/pronunciation exercises

## Progress Calculation

- **Section Progress**: Calculated as completed lessons / total lessons for that section
- **Overall Progress**: Average of all five section progresses
- **Lesson Completion**: A lesson is marked complete when ALL sections are finished
- **Percentage Tracking**: All percentages are rounded to 2 decimal places
