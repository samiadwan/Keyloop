# Business Requirements Document (BRD)

# Keyloop -- Simplified Car Rental Booking

  Document Information   Details
  ---------------------- --------------------------------
  Document ID            BRD-KEYLOOP-2026-10-30
  Product Name           Keyloop
  Document Type          Business Requirements Document
  Version                1.0
  Status                 Draft
  Prepared Date          30 October 2026
  Business Domain        Car Rental / Vehicle Booking
  Primary User           Anonymous Renter

------------------------------------------------------------------------

## 1. Executive Summary

### 1.1 Purpose

This Business Requirements Document defines the business requirements
for the simplified Keyloop car rental booking application.

The application enables anonymous renters to browse predefined vehicles,
search by pickup location and rental dates, review vehicle information,
select insurance coverage, complete a simulated checkout, and manage
bookings through My Trips / Booking History.

No registration, authentication, or permanent customer profile is
required.

### 1.2 Business Overview

Keyloop provides a lightweight, browser-based rental booking experience
using a fixed collection of seed vehicles. Renters can:

-   Browse predefined rental vehicles.
-   Search by pickup location and rental date range.
-   Review vehicle details and daily rental prices.
-   Create bookings and select insurance coverage.
-   Review rental charges.
-   Complete a simulated card checkout.
-   View all bookings created during the current browser session.
-   Cancel eligible bookings.

This release demonstrates the rental booking journey; it is not a
production-ready marketplace or payment platform.

------------------------------------------------------------------------

## 2. Business Background and Problem Statement

### 2.1 Background

The Keyloop initiative aims to simplify the traditional vehicle rental
booking journey through a straightforward browser-based experience. The
initial release removes account registration and maintains booking
information only for the current browser session.

### 2.2 Business Problem

A simplified rental booking experience needs a clear and consistent
process for vehicle discovery, booking creation, charge calculation,
simulated payment, and booking history management.

Without a defined booking lifecycle and centralized trip history, users
may experience:

-   Difficulty tracking multiple bookings.
-   Inconsistent booking statuses.
-   Loss of visibility into previously created bookings.
-   Unclear rental charges and insurance costs.
-   Confusion between pending and successfully completed bookings.

### 2.3 Proposed Business Solution

Keyloop will provide a session-based rental booking workflow and a
centralized My Trips / Booking History feature.

Every booking will be an individual record in a session-level
collection. Successful simulated checkout will update only the
corresponding booking, without affecting other bookings.

------------------------------------------------------------------------

## 3. Business Objectives

The primary business objectives are:

1.  Provide a simple rental booking experience without mandatory
    registration.
2.  Enable vehicle discovery through location and rental-date searches.
3.  Establish a consistent booking lifecycle from booking creation to
    payment completion.
4.  Provide transparent rental charges and selectable insurance options.
5.  Allow renters to view and manage multiple bookings during their
    current browser session.
6.  Protect payment information by ensuring sensitive card details are
    not persisted.
7.  Demonstrate an end-to-end rental booking journey using predefined
    vehicle data and simulated payment processing.

### 3.1 Success Criteria

The solution will be considered successful when:

-   Seed vehicles are displayed on the landing page.
-   Renters can search for and select vehicles.
-   Booking creation generates unique booking records.
-   Rental charges update correctly when insurance is changed.
-   Successful checkout changes the correct booking to Paid.
-   My Trips displays all bookings created during the current session.
-   Booking cancellation updates the selected booking without removing
    its history.
-   Sensitive payment information is never persisted.

------------------------------------------------------------------------

## 4. Scope Definition

### 4.1 In Scope

1.  Vehicle catalogue with a small predefined collection of seed
    vehicles.
2.  Landing page with vehicle search.
3.  Location-based and rental-date filtering.
4.  Vehicle detail page.
5.  Booking creation and Pending status management.
6.  Insurance selection and rental charge calculation.
7.  Simulated card checkout.
8.  Booking status management.
9.  My Trips / Booking History.
10. Booking cancellation.
11. Session-based booking persistence.
12. Navigation between booking stages and My Trips.

### 4.2 Out of Scope

-   User registration and authentication.
-   Sign-in and sign-up.
-   Identity verification and permanent customer profiles.
-   Host vehicle creation and listing management.
-   Real payment gateway integration.
-   Saved payment cards and payment receipts emailed to an account.
-   Storing card numbers or CVVs in browser storage.
-   Using browser storage as the secure source of payment or booking
    truth.
-   Host approval and vehicle availability management.
-   Deposits and actual insurance underwriting.
-   Starting or ending a rental trip.
-   Messaging, ratings, and reviews.
-   Metro, subsidy, and regulatory go/no-go requirements from the
    original brief.

------------------------------------------------------------------------

## 5. Business Process -- To-Be

### 5.1 Future-State Booking Journey

1.  The renter opens the Keyloop landing page.
2.  The application displays the predefined vehicle collection.
3.  The renter searches using pickup location and rental dates.
4.  The renter selects a vehicle and opens its detail page.
5.  The renter reviews vehicle information and rental price.
6.  The renter selects **Continue booking**.
7.  The application creates a new booking record with **Pending**
    status.
8.  The renter reviews payment details and selects an insurance option.
9.  The application calculates the rental charges and total amount.
10. The renter proceeds to card checkout.
11. The renter enters the required cardholder and card information.
12. The application validates the required checkout fields.
13. Upon successful validation, the selected booking status changes to
    **Paid**.
14. The renter can access My Trips to view all bookings created during
    the current session.
15. The renter may cancel a Pending or Paid booking from My Trips.

### 5.2 Booking Process Flow

``` mermaid
flowchart TD
    A[Landing Page] --> B[Search Vehicles]
    B --> C[Select Vehicle]
    C --> D[Vehicle Details]
    D --> E[Continue Booking]
    E --> F[Create Pending Booking]
    F --> G[Payment Details]
    G --> H[Select Insurance]
    H --> I[Review Charges]
    I --> J[Card Checkout]
    J --> K{Valid Checkout?}
    K -->|Yes| L[Update Booking to Paid]
    K -->|No| M[Show Validation Error]
    M --> J
    L --> N[My Trips]
    F --> N
    N --> O[View Booking History]
    O --> P{Cancel Booking?}
    P -->|Yes| Q[Update Status to Cancelled]
    P -->|No| R[Retain Booking]
```

### 5.3 Navigation Requirements

The Trips navigation entry must remain accessible from:

-   Landing page.
-   Vehicle detail page.
-   Payment details page.
-   Card checkout page.

Selecting Trips opens My Booked Trips and displays the complete booking
collection for the current browser session.

------------------------------------------------------------------------

## 6. Business Requirements

The following requirements define what the Keyloop solution must
achieve.

  -----------------------------------------------------------------------
  ID                                  Business Requirement
  ----------------------------------- -----------------------------------
  BR-1                                The system shall display a
                                      predefined collection of rental
                                      vehicles when the landing page
                                      loads.

  BR-2                                The system shall allow renters to
                                      search vehicles by pickup location
                                      and rental date range.

  BR-3                                The system shall allow renters to
                                      view vehicle information and rental
                                      pricing before creating a booking.

  BR-4                                The system shall create a separate
                                      Pending booking record whenever a
                                      renter selects Continue booking
                                      with valid rental dates.

  BR-5                                The system shall provide insurance
                                      selection and a transparent
                                      breakdown of rental charges.

  BR-6                                The system shall provide a
                                      simulated card checkout process
                                      with required-field validation.

  BR-7                                The system shall update the
                                      corresponding booking to Paid when
                                      checkout validation succeeds.

  BR-8                                The system shall provide My Trips /
                                      Booking History to display all
                                      bookings created during the current
                                      browser session.

  BR-9                                The system shall allow renters to
                                      cancel Pending and Paid bookings
                                      while retaining the booking record.

  BR-10                               The system shall maintain booking
                                      information throughout the current
                                      browser tab session, including page
                                      refreshes.

  BR-11                               The system shall prevent sensitive
                                      payment card information from being
                                      persisted in browser storage or
                                      application logs.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 7. Functional Requirements

### 7.1 FR -- Landing Page and Vehicle Search

The landing page shall serve as the primary entry point for renters.

-   **FR-1.1** The system shall display the predefined seed vehicle
    collection immediately upon initial page load.
-   **FR-1.2** Each vehicle card shall display a vehicle photograph,
    vehicle name, rental location, and daily rental price.
-   **FR-1.3** Renters shall be able to search vehicles using pickup
    location, pickup date, and return date.
-   **FR-1.4** Search results shall display vehicles matching the
    selected search criteria.
-   **FR-1.5** If no vehicles match the search criteria, the system
    shall display an informative no-results message rather than an empty
    page.
-   **FR-1.6** Selecting a vehicle card shall navigate the renter to its
    detail page.
-   **FR-1.7** The Trips navigation entry shall be accessible from the
    landing page.

### 7.2 FR -- Vehicle Details and Booking Creation

-   **FR-2.1** The vehicle detail page shall display relevant vehicle
    information, including name, photograph, location, and daily rental
    price.
-   **FR-2.2** The page shall retain the selected pickup location and
    rental dates when navigated from search results.
-   **FR-2.3** If the renter opens a vehicle without rental dates,
    **Continue booking** shall remain disabled until valid pickup and
    return dates are provided.
-   **FR-2.4** The system shall validate that the return date is later
    than the pickup date.
-   **FR-2.5** Selecting **Continue booking** shall create a new booking
    record containing a unique booking ID, selected vehicle, pickup
    location, pickup date, return date, booking creation date, and
    initial status of Pending.
-   **FR-2.6** Every booking creation action shall append a new record
    to the booking collection without overwriting existing records.
-   **FR-2.7** Upon successful booking creation, the renter shall be
    redirected to Payment Details for that booking.

### 7.3 FR -- Payment Details and Insurance Selection

-   **FR-3.1** The payment details page shall display the selected
    vehicle and rental information.
-   **FR-3.2** The renter shall be required to select one insurance
    option before proceeding to checkout.
-   **FR-3.3** The system shall provide the following insurance options:

  Insurance Tier     Amount
  ---------------- --------
  Basic                 500
  Standard            1,000
  Premium             1,500

*Currency is to be confirmed.*

-   **FR-3.4** The system shall display a rental charge breakdown
    containing daily rental price, number of rental days, base rental
    amount, selected insurance amount, one platform-fee line, and final
    payable total.
-   **FR-3.5** The base rental amount shall be calculated as:
    `Daily Rental Price × Rental Days`.
-   **FR-3.6** Changing the insurance selection shall immediately update
    the insurance charge and final total.
-   **FR-3.7** The platform fee shall appear as a single charge line in
    the breakdown.
-   **FR-3.8** Selecting **Continue** shall navigate to Card Checkout
    for the corresponding Pending booking.

### 7.4 FR -- Card Checkout and Simulated Payment

-   **FR-4.1** The checkout page shall display the booking and payment
    summary.
-   **FR-4.2** The checkout form shall collect cardholder name, card
    number, expiry date, and security code (CVV).
-   **FR-4.3** All checkout fields shall be mandatory.
-   **FR-4.4** The system shall validate the required fields before
    accepting checkout submission.
-   **FR-4.5** Card information shall be handled in application memory
    only and shall not be written to sessionStorage, localStorage, or
    application logs.
-   **FR-4.6** Upon successful validation, the system shall update only
    the corresponding booking record from Pending to Paid.
-   **FR-4.7** Successful checkout shall discard the entered card
    information.
-   **FR-4.8** If checkout validation fails, the system shall display an
    appropriate validation error, keep the renter on the checkout page,
    retain the booking status as Pending, and avoid modifying other
    booking records.
-   **FR-4.9** The checkout process shall be explicitly treated as a
    payment simulation and shall not initiate a real financial
    transaction.

### 7.5 FR -- My Trips / Booking History

The My Trips section shall provide renters with a centralized view of
all bookings created during their current browser session.

-   **FR-5.1** The system shall provide a Trips navigation entry on the
    landing, vehicle detail, payment details, and checkout pages.
-   **FR-5.2** Selecting Trips shall navigate the renter to the My
    Booked Trips page.
-   **FR-5.3** The system shall retrieve and display every booking from
    the current session's booking collection.
-   **FR-5.4** The booking history shall display all booking statuses,
    including Pending, Paid, and Cancelled.
-   **FR-5.5** Each booking entry shall display vehicle name, pickup
    location, rental pickup and return dates, booking status, booking
    ID, and booking creation date.
-   **FR-5.6** The booking list shall follow this visual hierarchy:
    primary trip information, booking status, booking ID, and booking
    creation date.
-   **FR-5.7** Every booking shall have a unique sequential booking ID
    within the current session, following the format TRP-001, TRP-002,
    TRP-003, and so on.
-   **FR-5.8** When a renter creates another booking, the new booking
    shall appear alongside previously created bookings without replacing
    them.
-   **FR-5.9** The booking collection shall remain available after
    refreshing the current browser tab.
-   **FR-5.10** A newly opened independent browser tab or a closed and
    subsequently reopened tab shall begin with an empty booking
    collection.
-   **FR-5.11** If no bookings exist, the system shall display the exact
    empty-state message: **"You haven't booked any trips yet"**. The
    empty state shall also provide a button that redirects the renter to
    the landing page to explore available vehicles.
-   **FR-5.12** The renter shall be able to cancel an individual booking
    with Pending or Paid status.
-   **FR-5.13** Upon cancellation, the selected booking status shall
    change to Cancelled.
-   **FR-5.14** Cancelled bookings shall remain visible in the booking
    history.
-   **FR-5.15** Cancelling one booking shall not modify or remove any
    other booking.

------------------------------------------------------------------------

## 8. Business Rules

  -----------------------------------------------------------------------
  Rule ID                             Business Rule
  ----------------------------------- -----------------------------------
  RULE-01                             The application shall not require
                                      user registration or
                                      authentication.

  RULE-02                             Vehicle information shall be
                                      sourced from a predefined seed
                                      collection.

  RULE-03                             A valid pickup date and return date
                                      are required before booking
                                      creation.

  RULE-04                             The return date must be later than
                                      the pickup date.

  RULE-05                             Each Continue booking action shall
                                      create a separate booking record.

  RULE-06                             Every newly created booking shall
                                      initially have Pending status.

  RULE-07                             Only successful simulated checkout
                                      validation shall change a booking
                                      from Pending to Paid.

  RULE-08                             A failed checkout attempt shall
                                      leave the booking Pending.

  RULE-09                             A renter must select exactly one
                                      insurance option before proceeding
                                      to checkout.

  RULE-10                             Each booking shall have a unique
                                      sequential identifier within its
                                      current session.

  RULE-11                             Only Pending and Paid bookings may
                                      be cancelled.

  RULE-12                             Cancelled bookings shall remain in
                                      the booking collection and retain
                                      their booking details.

  RULE-13                             Cancelling one booking shall not
                                      affect other bookings.

  RULE-14                             Card numbers and CVVs shall never
                                      be persisted in browser storage or
                                      application logs.

  RULE-15                             Booking information shall be
                                      available only within the
                                      applicable browser session.
  -----------------------------------------------------------------------

### 8.1 Booking Status Lifecycle

  -----------------------------------------------------------------------
  Status                  Definition              Allowed Action
  ----------------------- ----------------------- -----------------------
  Pending                 Booking created, but    Complete checkout or
                          simulated payment has   Cancel
                          not completed           
                          successfully.           

  Paid                    Checkout validation     Cancel
                          succeeded.              

  Cancelled               Renter cancelled the    View history
                          booking.                
  -----------------------------------------------------------------------

Allowed transitions:

-   New booking → Pending
-   Pending → Paid
-   Pending → Cancelled
-   Paid → Cancelled

Cancelled is a terminal status for this release. Rebooking creates a new
booking record.

------------------------------------------------------------------------

## 9. Data Requirements

### 9.1 Vehicle Seed Data

The application shall maintain a small predefined vehicle collection
containing everyday rental vehicles.

Each vehicle shall include:

-   Unique vehicle identifier.
-   Vehicle name.
-   Vehicle photograph.
-   Rental location.
-   Daily rental price.

The initial catalogue shall use fixed seed records. Host-created vehicle
listings are not supported.

### 9.2 Booking Data

  Field              Description
  ------------------ ---------------------------------------
  Booking ID         Unique session-level identifier
  Vehicle ID         Reference to the selected vehicle
  Vehicle Name       Selected vehicle name
  Pickup Location    Rental pickup location
  Pickup Date        Rental start date
  Return Date        Rental end date
  Booking Date       Date and time the booking was created
  Daily Price        Vehicle daily rental price
  Rental Days        Calculated rental duration
  Insurance Tier     Selected insurance option
  Insurance Amount   Selected insurance charge
  Platform Fee       Applicable platform fee
  Total Amount       Calculated rental total
  Status             Pending, Paid, or Cancelled

### 9.3 Session Storage Requirements

The application shall maintain bookings as an array/collection rather
than a single booking object.

The implementation may use an Angular session-state service backed by
browser sessionStorage, or direct sessionStorage management through an
appropriate application service.

The storage shall:

-   Maintain multiple booking records.
-   Support individual booking updates.
-   Preserve records after refresh within the same tab.
-   Start a new independent tab session with an empty collection.
-   Exclude card numbers and CVVs.
-   Not be considered a secure or authoritative system of record.

------------------------------------------------------------------------

## 10. Assumptions and Constraints

### 10.1 Assumptions

1.  No user account or authentication is required.
2.  Bookings belong to the current browser session.
3.  Every Continue booking action adds a new record to the booking
    collection.
4.  Successful checkout updates the corresponding booking to Paid.
5.  My Trips displays every booking created during the current session,
    including Pending and Cancelled records.
6.  Every booking displays its booking ID, trip details, booking date,
    and status.
7.  Payment is simulated. Successful form validation does not represent
    an actual card charge.
8.  Trips remains accessible from landing, vehicle detail, payment
    details, and checkout.
9.  If the booking collection is empty, the application displays **You
    haven't booked any trips yet** and provides navigation back to the
    landing page.
10. Angular sessionStorage or a session-state service shall maintain an
    array of booking records.

### 10.2 Constraints

1.  The application is limited to anonymous renters.
2.  Booking information is limited to the current browser session.
3.  The vehicle catalogue is predefined and not dynamically managed.
4.  Real payment processing is not included.
5.  No permanent database-backed booking history is required for this
    release.
6.  No sensitive card information may be persisted.
7.  Currency and platform-fee calculation are subject to business
    confirmation.

------------------------------------------------------------------------

## 11. Non-Functional Requirements

  -----------------------------------------------------------------------
  ID                      Category                Requirement
  ----------------------- ----------------------- -----------------------
  NFR-01                  Usability               The booking journey
                                                  shall provide clear
                                                  navigation and
                                                  understandable actions.

  NFR-02                  Performance             Seed vehicle
                                                  information shall be
                                                  available without
                                                  requiring a remote
                                                  catalogue service.

  NFR-03                  Security                Sensitive card
                                                  information shall not
                                                  be persisted in browser
                                                  storage or application
                                                  logs.

  NFR-04                  Data Integrity          Updating one booking
                                                  shall not overwrite or
                                                  modify other booking
                                                  records.

  NFR-05                  Reliability             Booking records shall
                                                  remain available after
                                                  refreshing the current
                                                  tab, provided the
                                                  browser session remains
                                                  active.

  NFR-06                  Maintainability         Booking operations
                                                  shall be managed
                                                  through a consistent
                                                  session-level booking
                                                  collection.

  NFR-07                  Compatibility           The application shall
                                                  support the agreed
                                                  modern desktop browser
                                                  environment.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 12. Acceptance Criteria

### 12.1 Vehicle Discovery

-   The landing page displays the predefined seed vehicles.
-   Location and rental dates filter the vehicle collection.
-   A no-results message appears when no vehicles match.
-   Selecting a vehicle opens its detail page.

### 12.2 Booking Creation

-   Valid rental dates are required before booking creation.
-   Selecting Continue booking creates a new Pending record.
-   Creating a second booking does not overwrite the first booking.
-   Each booking receives a unique session-level booking ID.

### 12.3 Charges and Checkout

-   One insurance option is required.
-   The rental charge breakdown displays the correct components.
-   Changing insurance updates the total.
-   Invalid checkout submission does not change the booking status.
-   Valid checkout submission changes only the selected booking to Paid.
-   Card numbers and CVVs are not persisted or logged.

### 12.4 My Trips / Booking History

-   Trips is accessible from all four specified booking journey pages.
-   All session bookings are displayed.
-   Pending, Paid, and Cancelled statuses are represented correctly.
-   A newly created booking appears alongside existing bookings.
-   Refreshing the same tab retains the booking collection.
-   A new independent tab starts with an empty collection.
-   The exact empty-state message is displayed when no bookings exist.
-   Cancelling a Pending or Paid booking changes its status to
    Cancelled.
-   Cancelled bookings remain visible in the history.

------------------------------------------------------------------------

## 13. Risks and Open Questions

### 13.1 Risks

  -----------------------------------------------------------------------
  Risk ID                 Description             Consideration
  ----------------------- ----------------------- -----------------------
  RISK-01                 Browser session         Clearly communicate
                          termination may result  session-based booking
                          in loss of booking      limitations.
                          history.                

  RISK-02                 Users may misunderstand Clearly identify the
                          simulated checkout as   checkout as a
                          an actual payment.      demonstration.

  RISK-03                 Currency and            Confirm commercial
                          platform-fee rules are  calculation rules
                          not finalized.          before implementation.

  RISK-04                 Browser storage is      Restrict session
                          client-controlled and   storage to
                          not authoritative.      demonstration-level
                                                  booking state.
  -----------------------------------------------------------------------

### 13.2 Open Questions

  -----------------------------------------------------------------------
  ID                      Question                Status
  ----------------------- ----------------------- -----------------------
  OQ-01                   Which currency should   Open
                          be used for rental      
                          prices and insurance    
                          amounts?                

  OQ-02                   What is the             Open
                          platform-fee amount or  
                          calculation method?     

  OQ-03                   Should rental duration  Open
                          count calendar days or  
                          apply another billing   
                          rule?                   

  OQ-04                   What exact vehicle      Open
                          names, locations, and   
                          daily prices should be  
                          used in the seed        
                          catalogue?              

  OQ-05                   Should cancellation     To confirm
                          require a confirmation  
                          dialog?                 

  OQ-06                   Should cancellation be  To confirm; current
                          available immediately   scope permits
                          after simulated         cancellation of Paid
                          payment?                bookings.

  OQ-07                   What date and           To confirm
                          card-format validation  
                          rules should be applied 
                          at checkout?            
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 14. Reference Documents

The following documents provide the source context for this BRD:

1.  **Keyloop Business Brief:** `brief-WMS-2026-08-29/brief.md`
    (`_bmad-output/planning-artifacts/briefs/brief-WMS-2026-08-29/brief.md`)
2.  **RideShare Product Requirements Document:** `rideshare-prd.md`
    (`_bmad-output/planning-artifacts/prds/prd-WMS-2026-08-30/rideshare-prd.md`)

The referenced documents provide background and product context. This
BRD narrows those inputs to the agreed simplified Keyloop rental booking
scope.

------------------------------------------------------------------------

## 15. Document Status

**Status: Draft**

This document defines the proposed business scope, booking journey,
business rules, functional requirements, assumptions, and acceptance
criteria for the simplified Keyloop rental booking application.

Items identified in the Open Questions section require confirmation
before the relevant business rules and calculations are finalized.
