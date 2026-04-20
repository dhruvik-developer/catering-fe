# Dish Module Restructuring - Implementation Plan

## Overview
Restructure the existing single-page Dish module into a 3-step wizard flow.

## Current State
- Single DishController + DishComponent handles everything
- formData holds: client info, schedule (multi-day with timeslots), dishes, extras, totals
- Modal-based dish selection per timeslot
- Submit creates event booking and navigates to PDF

## New 3-Page Structure

### Page 1: Client & Event Details
- Client: name, mobile_no, date, reference
- Event Schedule: multi-day support with event_date, timeLabel, estimatedPersons per slot
- "Next" button validates and goes to Page 2

### Page 2: Menu Selection  
- Based on the reference image: tab-based interface
- Tabs = each event timing (e.g., "BREAKFAST", "LUNCH", "DINNER")  
- Left sidebar = category list with search
- Right area = grid of dish items from selected category
- Selected dishes tracked per timeslot tab
- "Custom" and "Custom Package" toggle options shown in reference

### Page 3: Event Summary & Services
- Per-event summary showing: dishes, pricing, venue, timing
- Per-event: waiter section, extra services section
- Per-event: perPlatePrice input
- Bottom: Rules button, Suggestions button
- Submit button

## Files to Create/Modify
1. Keep `DishController.jsx` as the master wizard controller
2. Create `Step1_ClientEvent.jsx` - Client & event details form
3. Create `Step2_MenuSelection.jsx` - Tab-based menu selection (from reference image)  
4. Create `Step3_Summary.jsx` - Summary, waiters, extras, rules, suggestions
5. Modify `DishComponent.jsx` - becomes the stepper/wizard wrapper
