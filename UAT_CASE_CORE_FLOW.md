# UAT Case: Core Equipment Lifecycle

**Goal:** Validate the complete lifecycle of a piece of equipment from addition to assignment and return.

## Prerequisites
- Logged in as **Admin**.
- At least one user exists in the system (you can use your own admin account for assignment).

---

## Step 1: Add New Equipment
1.  Navigate to the **Equipment** page from the sidebar/navbar.
2.  Click the **"Add Equipment"** button.
3.  Fill in the details:
    *   **Name:** `Testing Laptop v1`
    *   **Type:** `Laptop`
    *   **Brand:** `Dell`
    *   **Serial Number:** `XYZ-98765` (Must be unique)
4.  Click **"Add Equipment"**.
5.  **Validation:** 
    *   [ ] Verify the laptop appears in the Equipment grid.
    *   [ ] Verify its status is **Available** (Green badge).

## Step 2: Assign Equipment
1.  Navigate to the **Assignments** page.
2.  Click **"New Assignment"**.
3.  Select:
    *   **Equipment:** `Testing Laptop v1 - XYZ-98765`
    *   **Assign To:** (Select your own name/email)
    *   **Notes:** `UAT Testing`
4.  Click **"Assign Equipment"**.
5.  **Validation:**
    *   [ ] Verify the assignment appears in the list as **active**.
    *   [ ] Go back to the **Equipment** page; verify the laptop status is now **Assigned** (Blue/Purple badge).
    *   [ ] Go to the **Dashboard**; verify the "Assigned" count has increased by 1.

## Step 3: Return Equipment
1.  Navigate back to the **Assignments** page.
2.  Locate the current assignment for `Testing Laptop v1`.
3.  Click the **"Return"** button.
4.  Confirm the return.
5.  **Validation:**
    *   [ ] Verify the assignment status changed to **returned**.
    *   [ ] Go to the **Equipment** page; verify the laptop status is back to **Available**.
    *   [ ] Check the **Audit Logs** (Admin only); verify the "Equipment Created", "Assignment Created", and "Return" actions are logged.

---

## Success Criteria
The UAT is successful if the equipment status accurately reflects its real-world state at every step and the audit trail is preserved.
