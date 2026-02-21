# UAT Case: Employee Onboarding & Offboarding Lifecycle

**Goal:** Validate the end-to-end workflow for onboarding multiple employees, provisioning them with equipment, and offboarding one of them.

## Roles Involved
- **IT Admin / HR:** Responsible for user management and equipment assignment.

---

## Part 1: Onboarding (Provisioning)

### Step 1: Create New Employee Users
1.  Navigate to the **Register** page (or use the Admin User management if implemented). 
    *Note: In this demo, use the `/register` route to create the test accounts.*
2.  Onboard 3 test employees:
    *   **User A:** `alice@example.com`, Role: `Employee`, Dept: `Engineering`
    *   **User B:** `bob@example.com`, Role: `Employee`, Dept: `Design`
    *   **User C:** `charlie@example.com`, Role: `Employee`, Dept: `Marketing`
3.  **Validation:** 
    *   [ ] Verify you can log out of Admin and log in briefly as Alice to see her (empty) dashboard.
    *   [ ] Log back in as **Admin**.

### Step 2: Bulk Provisioning
1.  Navigate to **Equipment**. Ensure you have at least 3 available laptops/items. (Add them if necessary).
2.  Navigate to **Assignments**.
3.  Create 3 assignments:
    *   **Assignment 1:** `Alice's Laptop` -> `Alice`
    *   **Assignment 2:** `Bob's Monitor` -> `Bob`
    *   **Assignment 3:** `Charlie's Keyboard` -> `Charlie`
4.  **Validation:**
    *   [ ] Verify the **Dashboard** reflects 3 more "Assigned" items.
    *   [ ] Verify **Notifications** were generated for each user.

---

## Part 2: Offboarding (Deprovisioning)

### Step 3: Equipment Recovery (Bob is leaving)
1.  Navigate to **Assignments**.
2.  Locate `Bob's Monitor`.
3.  Click **"Return"**. 
4.  **Note the Modal:** A popup will appear.
    *   Add note: `Employee Bob offboarded. Charger returned.`
    *   **Check the box:** "Decommission hardware" (This marks it as **Retired** automatically).
5.  **Validation:**
    *   [ ] Verify the Monitor status in **Equipment** is now **Retired**.
    *   [ ] Verify the assignment moves to "Returned" status and shows your note.

### Step 4: User Deactivation
1.  Navigate to the new **Users** page from the Navbar.
2.  Find **Bob** in the list.
3.  Click **Deactivate**.
4.  **Validation:**
    *   [ ] Bob's card should now appear faded/deactivated.
    *   [ ] Attempt to log in as Bob in a new Incognito window.
    *   [ ] **Expected Result:** Login fails with "Account is deactivated".
    *   [ ] (Optional) Click the **Trash** icon to permanently delete the user.

---

## Part 3: Reporting
1.  Navigate to **Analytics**.
2.  **Validation:**
    *   [ ] Verify the **Equipment Utilization** chart correctly counts the returned monitor as "Available".
    *   [ ] Verify the **Assignment Trends** reflect the 3 new assignments.

---

## Success Criteria
- Multiple users were successfully "onboarded" and provisioned.
- The offboarding process successfully recovered assets and secured the system by deactivating the leaving user's access.
- All actions were captured in the Audit Trail.
