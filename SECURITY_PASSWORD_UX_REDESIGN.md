# Security Password Component UX Redesign

## Overview

Redesigned the security password component to provide a cleaner, more modern UX similar to Privy.io. The main improvement is showing password inputs inline below the selected option and hiding unselected options for a focused, distraction-free experience.

## Key Changes

### 1. **Progressive Disclosure Pattern**

- **Initial State**: All 3 options are visible (Traditional Password, PIN, No Password)
- **After Selection**: Unselected options smoothly fade out and collapse
- **Selected Option**: Remains visible with a checkmark, and relevant form/content expands below it

### 2. **Inline Form Expansion**

- **Before**: Selecting any option would navigate to a completely different screen
- **After**: Form/content smoothly expands inline below the selected option card
- Uses smooth CSS transitions with cubic-bezier easing for a polished feel

### 3. **Improved Visual Flow**

1. User sees all 3 option cards
2. User clicks to select one (checkmark appears)
3. Other 2 options smoothly fade out and collapse
4. Form/content smoothly slides down below the selected card
5. User completes the flow (e.g., fills password fields)
6. User clicks continue button at the bottom

## Technical Implementation

### HTML Changes (`security-password.component.html`)

- All 3 options (Traditional Password, PIN, No Password) are now rendered
- Each option is wrapped in `security-password__option-wrapper` with conditional `--hidden` class
- Added `security-password__inline-form` for each option with visibility toggle
- Traditional Password shows full password form with validation
- PIN and No Password show simple informational content

### SCSS Changes (`security-password.component.scss`)

- **`&__option-wrapper`**:
    - Smooth collapse animation for unselected options
    - Uses max-height, opacity, and margin transitions
    - `--hidden` modifier collapses to 0 height with pointer-events disabled
- **`&__inline-form`**:
    - Smooth expansion animation for selected option's content
    - Transitions from max-height 0 to 600px
    - Opacity fade-in for smooth appearance
- **`&__form-content`**:
    - Light gray background (#f9f9fc)
    - Rounded corners (16px)
    - Proper spacing with gap and padding

### TypeScript Changes (`security-password.component.ts`)

- **`continueWithSelection()`** now handles all three options:
    - **Traditional Password**: Validates form, stores password, navigates to biometrics
    - **PIN**: Currently continues without password (TODO: implement full PIN flow)
    - **No Password**: Sets flag and continues to biometrics

## User Experience Benefits

1. **Focused Attention**: Hiding unselected options reduces cognitive load
2. **Visual Continuity**: No jarring screen replacements, everything flows smoothly
3. **Smooth Animations**: Professional cubic-bezier transitions feel polished
4. **Clearer Context**: User always sees their selection at the top
5. **Modern Design**: Matches contemporary UX patterns (Privy.io, Stripe, etc.)
6. **Reversible**: User can still go back if needed

## Animation Details

### Option Collapse/Expand

```scss
transition:
    max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    margin-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Form Expansion

```scss
transition:
    max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

The cubic-bezier easing (0.4, 0, 0.2, 1) provides a smooth, natural "ease-out" feel.

## Future Enhancements

- Implement full PIN creation flow with 6-digit input
- Add "Change Selection" button to show all options again
- Consider adding subtle micro-interactions on hover
- Add accessibility improvements (ARIA labels, keyboard navigation)
