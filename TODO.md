# TODO: Update Event Structure and Implement Agenda List View

## Steps to Complete

- [x] Update src/types/calendar.types.ts: Change CalendarEvent to use start and end (Date objects) instead of startDate/endDate.
- [x] Update src/utils/event.utils.ts: Replace all startDate/endDate with start/end.
- [x] Update src/components/Calendar/ListView.tsx: Change to use start/end, ensure it shows all events sorted by date then time.
- [x] Update src/components/Calendar/MonthView.tsx: Replace startDate/endDate with start/end.
- [x] Update src/components/Calendar/WeekView.tsx: Replace startDate/endDate with start/end.
- [x] Update src/components/Calendar/EventModal.tsx: Replace startDate/endDate with start/end.
- [x] Update src/components/Calendar/CalendarView.tsx: Replace startDate/endDate with start/end.
- [x] Update src/components/Calendar/CalendarCell.tsx: Replace startDate/endDate with start/end.
- [x] Update src/components/Calendar/CalendarView.stories.tsx: Replace startDate/endDate with start/end.
- [x] Update src/hooks/useCalendar.ts: Replace startDate/endDate with start/end if needed.
- [x] Update src/hooks/useEventManager.ts: Replace startDate/endDate with start/end if needed.
- [x] Test the ListView in Storybook to ensure it displays all events correctly.
- [x] Verify events are sorted by date (past to future), then by start time within each date.
- [x] Check styling and functionality.
- [ ] Commit changes and push to GitHub.
