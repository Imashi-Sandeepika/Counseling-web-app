# Database Tables Snapshot

This document shows all the database tables that contain records.

## Table: account (8 records)

| id | email | created_at |
| --- | --- | --- |
| 1 | imashisandeepika2001@gmail.com | 2026-02-05 18:13:13.402070 |
| 2 | nethmi@gmail.com | 2026-02-09 12:40:07.542722 |
| 3 | imashi@gmail.com | 2026-02-11 03:49:57.266767 |
| 4 | avishka@gmail.com | 2026-02-12 16:26:33.794252 |
| 5 | abc@123 | 2026-02-16 15:46:14.825452 |
| 6 | imashi123@gmail.com | 2026-02-16 16:09:39.904226 |
| 7 | vithukshiha@gmail.com | 2026-06-21 05:33:18.041841 |
| 8 | testuser@example.com | 2026-06-21 05:36:50.188756 |

## Table: counselor (3 records)

| id | name | available | email | password_hash | profile_image | languages | country | flag | nic | empathy | clarity | impact | dob | civil_status | specialty | education | experience | schedule | created_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | P.K.I.S. Bandara | 1 | bandara@example.com |  | images/MyOff.jpg | Sinhala, English | Sri Lanka | picures/LankaFlug.png |  | 4.8 | 4.6 | 4.7 |  |  |  |  |  | {} | 2026-02-05 16:42:10.479382 |
| 3 | W.A.M. Waduwaththa | 1 | imashibandara19@gmail.com | scrypt:32768:8:1$9LU7Zzidvg64PZ3z$3ff1389cbd3ddf3b255e1c7a42339fdb332c15b307102410eb5031ac77413826ab02a59ac55199113277e3f4417e2b3936b7249d5dba659e987408111d0f50ba | images/AvskOff.jpg | English,Tamil,Sinhala | Sri Lanka | images/LankaFlug.png | 200270104400 | 5.0 | 5.0 | 5.0 |  |  |  |  | 0 | {} | 2026-02-05 19:11:39.125027 |
| 4 | Rose Violet | 1 | rose@gmail.com | scrypt:32768:8:1$QXBOf7p6jWyOdZ7k$8277475f10e266e8c9fc226f76df8adffbe715456b39d5aaa4fa8953c4e403e326c52711b7db00ef013459db0ae5acba66251f78dc37822dac1ebf21848a1f12 | images/PereraProfile_1771237814.jpg | English , Spanish ,  | America | 🌍 | 19972345643 | 5.0 | 5.0 | 5.0 |  |  |  |  | 0 | {} | 2026-02-16 16:00:18.432164 |

## Table: session (2 records)

| id | user_email | start_ts | end_ts | category | counselor_name | notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | demo@example.com | 2026-02-05 16:42:10.484156 | 2026-02-05 16:42:10.484169 | Deep Breathing |  | Practiced 4-7-8 method. |
| 2 | demo@example.com | 2026-02-05 16:42:10.484466 | 2026-02-05 16:42:10.484472 | Relationship Issues | W.A.M.Waduwaththa | Discussed boundaries. |

## Table: notification (22 records)

| id | user_email | appointment_id | title | msg | status | related_person | related_image | ts |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 5 | nethmi@gmail.com | 2 | Appointment Requested | Your session with H.G. Rajapaksha on 2027-03-16 at 10:00 has been requested. | info | H.G. Rajapaksha | images/couns_2_1769248126.jpg | 2026-02-09 13:12:44.506130 |
| 6 | wadu@example.com | 2 | New Booking Request | A new client, nethmi@gmail.com, has requested a session on 2027-03-16 at 10:00. | info | nethmi@gmail.com | images/Client.jpg | 2026-02-09 13:12:44.510409 |
| 15 | nethmi@gmail.com | 6 | Appointment Declined | Your session with W.A.M. Waduwaththa on 2026-02-19 at 03:40 is now declined. | info | W.A.M. Waduwaththa | images/AvskOff.jpg | 2026-02-10 10:11:44.817651 |
| 16 | imashibandara19@gmail.com | 6 | Booking Declined | Appointment with nethmi@gmail.com on 2026-02-19 at 03:40 is now declined. | info | nethmi@gmail.com | images/Client.jpg | 2026-02-10 10:11:44.819510 |
| 17 | nethmi@gmail.com | 5 | Appointment Confirmed | Your session with W.A.M. Waduwaththa on 2026-02-15 at 16:30 is now confirmed. | success | W.A.M. Waduwaththa | images/AvskOff.jpg | 2026-02-10 10:57:04.272266 |
| 18 | imashibandara19@gmail.com | 5 | Booking Confirmed | Appointment with nethmi@gmail.com on 2026-02-15 at 16:30 is now confirmed. | info | nethmi@gmail.com | images/Client.jpg | 2026-02-10 10:57:04.276503 |
| 19 | nethmi@gmail.com | 4 | Appointment Declined | Your session with W.A.M. Waduwaththa on 2026-03-31 at 13:20 is now declined. | info | W.A.M. Waduwaththa | images/AvskOff.jpg | 2026-02-10 10:57:09.356473 |
| 20 | imashibandara19@gmail.com | 4 | Booking Declined | Appointment with nethmi@gmail.com on 2026-03-31 at 13:20 is now declined. | info | nethmi@gmail.com | images/Client.jpg | 2026-02-10 10:57:09.359703 |
| 21 | nethmi@gmail.com | 3 | Appointment Declined | Your session with W.A.M. Waduwaththa on 2026-02-23 at 18:00 is now declined. | info | W.A.M. Waduwaththa | images/AvskOff.jpg | 2026-02-10 10:59:26.286898 |
| 22 | imashibandara19@gmail.com | 3 | Booking Declined | Appointment with nethmi@gmail.com on 2026-02-23 at 18:00 is now declined. | info | nethmi@gmail.com | images/Client.jpg | 2026-02-10 10:59:26.291081 |
| 23 | nethmi@gmail.com | 7 | Appointment Requested | Your session with K.H.S. Thikshana on 2026-02-13 at 09:26 has been requested. | info | K.H.S. Thikshana | images/SilvaProfile.jpg | 2026-02-11 03:55:30.814210 |
| 24 | imashisandeepika2001@gmail.com | 7 | New Booking Request | A new client, nethmi@gmail.com, has requested a session on 2026-02-13 at 09:26. | info | nethmi@gmail.com | images/Client.jpg | 2026-02-11 03:55:30.816612 |
| 25 | imashisandeepika2001@gmail.com | 1 | Appointment Completed | Your session with W.A.M. Waduwaththa on 2026-03-12 at 08:30 is now completed. | info | W.A.M. Waduwaththa | images/AvskOff.jpg | 2026-02-11 04:01:47.470470 |
| 26 | imashibandara19@gmail.com | 1 | Booking Completed | Appointment with imashisandeepika2001@gmail.com on 2026-03-12 at 08:30 is now completed. | info | imashisandeepika2001@gmail.com | images/Client.jpg | 2026-02-11 04:01:47.471875 |
| 29 | avishka@gmail.com | 7 | Appointment Confirmed | Your session with W.A.M. Waduwaththa on 2026-02-10 at 13:42 is now confirmed. | success | W.A.M. Waduwaththa | images/AvskOff.jpg | 2026-02-12 20:15:31.958957 |
| 30 | imashibandara19@gmail.com | 7 | Booking Confirmed | Appointment with avishka@gmail.com on 2026-02-10 at 13:42 is now confirmed. | info | avishka@gmail.com | images/Client.jpg | 2026-02-12 20:15:31.961428 |
| 33 | nethmi@gmail.com | 9 | Appointment Requested | Your session with W.A.M. Waduwaththa on 2026-02-28 at 14:30 has been requested. | info | W.A.M. Waduwaththa | images/AvskOff.jpg | 2026-02-17 06:52:18.726693 |
| 34 | imashibandara19@gmail.com | 9 | New Booking Request | A new client, nethmi@gmail.com, has requested a session on 2026-02-28 at 14:30. | info | nethmi@gmail.com | images/Client.jpg | 2026-02-17 06:52:18.728760 |
| 35 | nethmi@gmail.com | 8 | Appointment Declined | Your session with Rose Violet on 2026-04-10 at 21:40 is now declined. | info | Rose Violet | images/PereraProfile_1771237814.jpg | 2026-02-17 06:52:55.658495 |
| 36 | rose@gmail.com | 8 | Booking Declined | Appointment with nethmi@gmail.com on 2026-04-10 at 21:40 is now declined. | info | nethmi@gmail.com | images/Client.jpg | 2026-02-17 06:52:55.660259 |
| 37 | vithukshiha@gmail.com | 10 | Appointment Requested | Your session with W.A.M. Waduwaththa on 2026-07-19 at 22:00 has been requested. | info | W.A.M. Waduwaththa | images/AvskOff.jpg | 2026-06-21 06:20:40.015567 |
| 38 | imashibandara19@gmail.com | 10 | New Booking Request | A new client, vithukshiha@gmail.com, has requested a session on 2026-07-19 at 22:00. | info | vithukshiha@gmail.com | images/Client.jpg | 2026-06-21 06:20:40.016642 |

## Table: user (9 records)

| id | name | email | password_hash | created_at | last_login |
| --- | --- | --- | --- | --- | --- |
| 1 | Imashi | imashisandeepika2001@gmail.com | scrypt:32768:8:1$DgcqxbPSbgPd7DCP$383b84d05d089f146eb0fec5e9f7fa0558496926a1d3052f8e2f73123998e601c854629ee498750958e51c6e3771577f29a2b0d494a1ee5f0337521ab76c8ae6 | 2026-02-05 18:13:13.411352 | 2026-02-09 12:31:25.375230 |
| 2 | Nethmi | nethmi@gmail.com | scrypt:32768:8:1$RasNyrsAYrtkAyCw$6992437f0f4a2698dfe051021889269be58c493f91cd0f6a640950a300e4ab102a79b32fe2fe8aebcaba06758129218ddbb807fc06c81174eeecdf951bc75144 | 2026-02-09 12:40:07.551125 | 2026-03-30 19:41:59.020887 |
| 3 | W.A.M. Waduwaththa | imashibandara19@gmail.com | scrypt:32768:8:1$r9Cx1EhBBnwMFS2F$7a7a7c3018e57a68d3189f92819848292463ce2b5a8ea98990c4684d27bbd07f9b0d90648a654aa2ef1bc4ba1f5b8dee5a602787985c4a3398694ffe0ea1dd6e | 2026-02-05 19:11:39.125027 |  |
| 4 | anna | imashi@gmail.com | scrypt:32768:8:1$ZvqCouHirvd8s6SU$2243f6d5db0018cbf29ead2a09abc8c7192ed6b3447b093734a790e32472dff3088a2eaf2493d8f4dbe0a3e5b5354163be5a8f2864f83d5e3c847569655a6c42 | 2026-02-11 03:49:57.274771 | 2026-02-11 03:50:01.881428 |
| 5 | avishka | avishka@gmail.com | scrypt:32768:8:1$2k6O4uSSdDNXiuWi$97f8d108a846553ceced6741bf047a5c21eba97726f4bcec0d1875848b9fdfb597e833419f6329c405f62ad2c5e23ab0f3e1c566751d9226aacfbf0164045faa | 2026-02-12 16:26:33.805627 | 2026-02-16 15:45:29.824332 |
| 6 | Imashi | abc@123 | scrypt:32768:8:1$hj69lK46qZwGJSBY$a54943c124dfcd5f12b2d9153aac33dd60e5afae7b3a74f722c3fd2c9ab8b3ded77ccd6e6117c99c9bfc183355d1d89971ad7dbdc058d971efc328cda6014bec | 2026-02-16 15:46:14.833943 | 2026-02-16 15:46:21.193220 |
| 7 | Imashi | imashi123@gmail.com | scrypt:32768:8:1$x9N3YaFDTVDBzFjD$a26bcc008a3637762bbd74020aa7e33bb3fa271bfe0980ced0c158b459304e23664a70e56c6f71443ee7eb9762306623c22a2736103b8e5bdd3855166485c960 | 2026-02-16 16:09:39.910797 | 2026-02-16 16:09:45.287872 |
| 8 | Vithukshiha | vithukshiha@gmail.com | scrypt:32768:8:1$lmvf87RSh9MTy6nT$2205eb361f860a62bceccff7a7dc10471e539e9312f0a2ce2a40bb5abd224ce1bb971847defe7aa7ee01ed7e1390ce6cfa128206111a7963bfc328bc5433350c | 2026-06-21 05:33:18.051826 | 2026-06-21 06:11:17.749272 |
| 9 | Test User | testuser@example.com | scrypt:32768:8:1$KsWxC6q22TT3YkUQ$95e01478f99ede5381ede59bcd970b1b1f46312d907c9fb224f8d8d9bf24414d22561977741a89d062200447933469c23a1e6383510e5948629a4dfa54cb94f7 | 2026-06-21 05:36:50.190509 | 2026-06-21 05:37:16.621512 |

## Table: admin (2 records)

| id | name | email | password_hash | created_at |
| --- | --- | --- | --- | --- |
| 1 | Administrator | admin@example.com | scrypt:32768:8:1$Otg3uT5iarUJoC9C$201a46090c560ef9056204081bf3270af84dcbe61134e774eb55ddfc7e47b1fbabb60971a3bc65a4b79dba4090874dae092fc3b035ddb5c25879728d00f02870 | 2026-02-05 16:42:10.647408 |
| 2 | System Admin | admin@psycare.com | scrypt:32768:8:1$kWi9LGhLoN9wGhl9$b9b9229d9549d86668c5afa21925e240dedad173dbbb530d291eaf9b7cf3e51cc389ffb7dd737d55b3437a65a94b851ab4a5affd1421e09484bc1e2585db8f92 | 2026-03-30 18:51:25.033301 |

## Table: appointment (9 records)

| id | counselor_id | user_email | date | time | ts | status | payment_status | passcode | zoom_link | receipt_url |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | imashisandeepika2001@gmail.com | 2026-03-12 | 08:30 | 2026-02-06 03:02:13.475947 | completed | unpaid |  |  |  |
| 3 | 3 | nethmi@gmail.com | 2026-02-23 | 18:00 | 2026-02-09 13:16:57.509852 | declined | unpaid |  |  |  |
| 4 | 3 | nethmi@gmail.com | 2026-03-31 | 13:20 | 2026-02-10 07:47:43.862284 | declined | unpaid |  |  |  |
| 5 | 3 | nethmi@gmail.com | 2026-02-15 | 16:30 | 2026-02-10 10:00:39.073926 | confirmed | unpaid |  |  |  |
| 6 | 3 | nethmi@gmail.com | 2026-02-19 | 03:40 | 2026-02-10 10:10:47.456128 | declined | unpaid |  |  |  |
| 7 | 3 | avishka@gmail.com | 2026-02-10 | 13:42 | 2026-02-12 20:09:07.564737 | confirmed | unpaid |  |  |  |
| 8 | 4 | nethmi@gmail.com | 2026-04-10 | 21:40 | 2026-02-16 16:06:22.349354 | declined | unpaid |  |  |  |
| 9 | 3 | nethmi@gmail.com | 2026-02-28 | 14:30 | 2026-02-17 06:52:18.720041 | pending | unpaid |  |  |  |
| 10 | 3 | vithukshiha@gmail.com | 2026-07-19 | 22:00 | 2026-06-21 06:20:40.006010 | pending | unpaid |  |  |  |
