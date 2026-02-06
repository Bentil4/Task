# Dynamic Routing Implementation

## Route Parameters

### Board Route with Dynamic ID
- **Route**: `/board/:id`
- **Example**: `/board/1`, `/board/2`, `/board/3`
- The `id` parameter controls which board is displayed

## Query Parameters

### Filter by Status
- **Parameter**: `filter`
- **Example**: `/board/1?filter=todo`
- Filters tasks by their status

### Sort Tasks
- **Parameter**: `sort`
- **Values**: `title`, `subtasks`
- **Example**: `/board/1?sort=title`

### Combined Parameters
- **Example**: `/board/2?filter=doing&sort=title`
- Filters tasks with "doing" status and sorts by title

## Testing the Implementation

1. Navigate to different boards:
   - `/board/1` - Platform Launch
   - `/board/2` - Marketing Plan
   - `/board/3` - Roadmap

2. Add query parameters:
   - `/board/1?filter=todo` - Show only todo tasks
   - `/board/1?sort=title` - Sort tasks alphabetically
   - `/board/1?filter=doing&sort=subtasks` - Filter and sort

3. The application automatically responds to parameter changes without page reload.
