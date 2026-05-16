// "use client";
// import React, { useState } from "react";
// import type { CSSProperties } from "react";

// /* ─────────────────────────────────────────────
//    DATA (UPDATED WITH ALL NEW Q&A)
// ───────────────────────────────────────────── */
// const categories = [
//   {
//     id: 1,
//     label: "1. General Information",
//     icon: "🏛️",
//     headerBg: "bg-blue-600",
//     viewAllColor: "text-blue-600",
//     total: 20,
//     ellipsisAfter: 4,
//     questions: [
//       "1. What is Meridians Group of Education?",
//       "2. Where is your institute located?",
//       "3. What programs do you offer?",
//       "4. What age groups do you cater to?",
//       "5. Do you offer both academic and skill-based courses?",
//       "6. What makes your institute different from others?",
//       "7. Are your courses certified?",
//       "8. Do you offer online classes?",
//       "9. What are your operating hours?",
//       "10. How can I contact your institute?",
//       "11. Do you have multiple branches?",
//       "12. What is your mission and vision?",
//       "13. Who are your instructors?",
//       "14. Do you offer counseling before admission?",
//       "15. Is your institute registered?",
//       "16. Do you provide career guidance?",
//       "17. Can parents visit the institute?",
//       "18. Do you have a website and social media pages?",
//       "19. How long have you been operating?",
//       "20. Do you offer trial classes?",
//     ],
//     answers: [
//       "It is an educational and skill-development institute offering academic tutoring, digital skills, and professional IT courses.",
//       "Main Campus: Bhatta Chowk Bedian Road, near Go Petrol Pump, Lahore. Branch#2: Amjad Colony, Tatla Road I, Heir Lahore. Branch#3: Bedian Road, Alfalfa Town near Touheed Mart, Lahore.",
//       "We offer classes from Playgroup to Intermediate.",
//       "We cater to kids, young students, and adults.",
//       "Yes, we offer both academic tuitions and skill-based IT/professional courses.",
//       "We focus on conceptual learning, small class sizes, and practical, project-based training.",
//       "Yes, Our institution is affiliated with the board, so students receive regular degrees. We also provide proper certification for all skill-based courses.",
//       "Yes, we offer online classes for academic.",
//       "7:30 am to 1pm (morning) and 3:45 pm to 8.30 pm (evening)",
//       "You can call us at 0321-4712207, 0303-3569000, 0304-4230664, 0304-4641590(Heir), 0303-4027152(Heir) or visit our campus.",
//       "Yes, we have multiple branches in Lahore. Main Campus: Bhatta Chowk Bedian Road, near Go Petrol Pump, Lahore - Branch#2: Amjad Colony, Tatla Road I, Heir Lahore - Branch#3: Bedian Road, Alfalfa Town near Touheed Mart, Lahore",
//       "To bridge learning gaps, foster conceptual understanding, and equip students with modern skills.",
//       "Qualified subject specialists and expert IT instructors.",
//       "Yes, counseling is provided to help students select the right program.",
//       "Yes, our institution is affiliated with Lahore board and registered from government of Punjab.",
//       "Yes, we provide career, academic, and freelancing guidance.",
//       "Yes, parents are welcome to visit during operating hours.",
//       "Yes, we maintain an active online presence.",
//       "We have been successfully operating since 2004, delivering quality education and strong results.",
//       "Yes, trial classes are available for new enrollments.",
//     ],
//   },
//   {
//     id: 2,
//     label: "2. Academic Programs (PG–12)",
//     icon: "🎓",
//     headerBg: "bg-teal-600",
//     viewAllColor: "text-teal-600",
//     total: 40,
//     ellipsisAfter: 4,
//     questions: [
//       "21. Do you offer classes for Playgroup (PG)?",
//       "22. What subjects are taught at primary level?",
//       "23. Do you follow any specific board (Punjab, Cambridge, etc.)?",
//       "24. Do you prepare students for board exams?",
//       "25. Are your teachers subject specialists?",
//       "26. Do you provide homework support?",
//       "27. How do you track student progress?",
//       "28. Are monthly tests conducted?",
//       "29. Do you offer crash courses for exams?",
//       "30. Can weak students get extra support?",
//       "31. Do you provide notes and study material?",
//       "32. Are small class sizes maintained?",
//       "33. Do you offer science and arts streams?",
//       "34. Are practicals included for science students?",
//       "35. Do you help with assignment preparation?",
//       "36. Do you offer revision classes?",
//       "37. What is your pass success rate?",
//       "38. Do you offer weekend classes?",
//       "39. Can students switch batches?",
//       "40. Do you offer O-Level/Matric support?",
//       "41. Do you teach English medium students?",
//       "42. Do you offer Urdu medium support?",
//       "43. How do you handle slow learners?",
//       "44. Do you provide one-on-one tutoring?",
//       "45. Are there quizzes and activities?",
//       "46. Do you prepare students for entry tests?",
//       "47. Do you offer summer school programs?",
//       "48. Are parents updated regularly?",
//       "49. Do you provide progress reports?",
//       "50. Do you focus on conceptual learning?",
//       "51. Do you offer group study sessions?",
//       "52. Can students repeat classes?",
//       "53. Do you teach Islamic studies?",
//       "54. Do you offer computer basics to school students?",
//       "55. Are co-curricular activities included?",
//       "56. Do you help in exam strategy?",
//       "57. Are classes interactive?",
//       "58. Do you provide exam past papers?",
//       "59. Do you teach spoken English alongside academics?",
//       "60. Are there separate batches for girls and boys?",
//     ],
//     answers: [
//       "Yes, we offer kindergarten classes along with daycare facilities. We accept children above 1 year of age and provide a safe, caring, and learning-friendly environment where they can grow, play, and develop basic skills under proper supervision.",
//       "Math, English, Urdu, Science, Nazra and computer basics.",
//       "We support Punjab Board systems.",
//       "Yes, we prepare students for Matric and FSc/Intermediate board exams with a well-planned and student-friendly approach. We focus on concept-based learning, regular revision, and organized test sessions to help students stay confident and fully prepared for their exams.",
//       "Yes, all academic subjects are taught by qualified specialists.",
//       "Yes, we assist students with their daily school assignments and homework.",
//       "Progress is tracked through weekly test, monthly Assessments, quizzes, and regular reporting.",
//       "Yes, monthly tests are conducted to assess performance.",
//       "Yes, crash courses are offered for quick and efficient exam preparation.",
//       "Yes, we provide one-on-one attention and extra tutoring for weaker students.",
//       "Yes, we provide comprehensive study materials and notes.",
//       "Yes, small class sizes ensure individual attention.",
//       "Yes, we offer both Science and Arts streams. Students are guided according to their chosen field, and we also provide opportunities like science fairs and arts exhibitions where they can showcase their creativity, projects, and skills in a practical and confident way.",
//       "Yes, we provide full guidance and support for science practicals. Students are properly taught and their practicals are performed under supervision to help them understand concepts in a clear and hands-on way.",
//       "Yes, we assist with academic assignments.",
//       "Yes, we conduct revision classes prior to exams.",
//       "Our result is consistently excellent, with 100% pass rate, and most students easily achieve 90% marks or above.",
//       "Yes, we also offer weekend classes on a conditional basis, depending on student need and availability.",
//       "Yes, students can switch batches subject to availability.",
//       "We offer comprehensive support for Matric examinations.",
//       "Yes, we teach English medium students.",
//       "Yes, we provide support in Urdu as well.",
//       "Through extra time, remedial classes, and personalized attention.",
//       "Yes, we offer one-on-one tutoring upon request.",
//       "Yes, quizzes and activities are included to keep learning engaging.",
//       "Yes, we help prepare students for college and university entry tests, including all entry tests such as MDCAT, ECAT, and others.",
//       "Yes, we conduct a proper summer school program, including regular summer classes and a fun-filled Summer Fiesta, where students learn new skills along with engaging and creative activities.",
//       "Yes, we keep parents regularly updated about student progress through parent app, SMS alerts, and other communication platforms to ensure better coordination and transparency.",
//       "Yes, progress reports are shared with parents.",
//       "Yes, conceptual clarity is the core focus of our teaching.",
//       "Yes, we facilitate collaborative study sessions.",
//       "Yes, students can repeat classes/grades if necessary.",
//       "Yes, Islamiyat is taught as an important part of the curriculum, including Nazra-e-Quran and basic Islamic education. We focus on moral values, proper understanding, and character building in a simple and meaningful way.",
//       "Yes, we offer computer basics for young students.",
//       "Yes, we integrate co-curricular activities for the holistic development of students. These include educational tours, science and arts exhibitions, annual celebrations, and various other school activities. All these programs help students build confidence, improve creativity, and develop teamwork and communication skills along with their studies.",
//       "Yes, we teach students how to manage their time and answer effectively during exams.",
//       "Yes, our classes are interactive and engaging.",
//       "Yes, we provide and review past papers.",
//       "Yes, we help students improve their spoken English through a specially designed course. In this program, students practice daily speaking, vocabulary building, pronunciation, and conversation skills in a friendly environment. We focus on boosting confidence so students can speak English fluently in both academic and real-life situations.",
//       "Yes, separate batches are available for boys and girls.",
//     ],
//   },
//   {
//     id: 3,
//     label: "3. Computer Courses",
//     icon: "💻",
//     headerBg: "bg-green-600",
//     viewAllColor: "text-green-600",
//     total: 40,
//     ellipsisAfter: 4,
//     questions: [
//       "61. What computer courses do you offer?",
//       "62. Do you offer basic computer courses?",
//       "63. What is included in basic IT training?",
//       "64. Do you offer MS Office training?",
//       "65. Do you teach Excel in detail?",
//       "66. Do you offer graphic designing courses?",
//       "67. Which software is taught in graphic design?",
//       "68. Do you teach Adobe Photoshop?",
//       "69. Do you offer web development courses?",
//       "70. Do you teach HTML, CSS, JavaScript?",
//       "71. Do you offer programming courses?",
//       "72. Which programming languages are taught?",
//       "73. Do you offer freelancing courses?",
//       "74. Do you teach Fiverr and Upwork skills?",
//       "75. Are practical projects included?",
//       "76. Do you students get certificates after completion?",
//       "77. What is the duration of computer courses?",
//       "78. Are classes beginner-friendly?",
//       "79. Do you provide lab facilities?",
//       "80. Can I take classes without prior experience?",
//       "81. Do you offer advanced IT courses?",
//       "82. Are online computer classes available?",
//       "83. Do you teach video editing?",
//       "84. Do you offer digital marketing courses?",
//       "85. Do you teach SEO basics?",
//       "86. Do you provide internship opportunities?",
//       "87. Can students bring their own laptops?",
//       "88. Are recordings provided for online classes?",
//       "89. Do you offer evening classes?",
//       "90. Are weekend batches available?",
//       "91. What is the fee structure?",
//       "92. Do you offer discounts on multiple courses?",
//       "93. Do you teach Canva tools?",
//       "94. Do you offer certification exams?",
//       "95. Do you help students earn online?",
//       "96. Are assignments given in courses?",
//       "97. Do you provide job placement support?",
//       "98. Can school students join computer courses?",
//       "99. Do you offer female-only batches?",
//       "100. How do I enroll in a computer course?",
//     ],
//     answers: [
//       "MS Office, Graphic Design, Web Development, Programming, Video Editing, and Digital Marketing.",
//       "Yes, we offer a fundamental computer course for beginners.",
//       "Typing, basic Windows navigation, and introductory software use.",
//       "Yes, we offer training in MS Word, Excel, and PowerPoint.",
//       "Yes, we cover basic and advanced Excel functions.",
//       "Yes, we offer graphic design courses using industry-standard tools.",
//       "Adobe Photoshop and Canva.",
//       "Yes, we teach photo editing and graphic creation.",
//       "Yes, we offer foundational web development training.",
//       "Yes, we cover the fundamentals of HTML, CSS, and JavaScript.",
//       "Yes, we teach introductory programming languages.",
//       "Languages such as Python and basic C++.",
//       "Yes, we offer training on how to use freelancing platforms.",
//       "Yes, we teach profile creation, gig optimization, and bid writing.",
//       "Yes, hands-on projects are part of all computer courses.",
//       "Yes, certificates are provided upon completion.",
//       "Courses are available with different durations depending on the program, ranging from 4 weeks to 6 months. Each course is designed according to its level and learning requirements to ensure proper understanding and skill development.",
//       "Yes, we start from basics, so beginners can learn easily.",
//       "Yes, fully equipped computer lab facilities are available with modern systems and smart board technology to provide an interactive and effective learning environment.",
//       "Yes, our courses are designed for absolute beginners.",
//       "Yes, advanced modules are available based on skill level.",
//       "Yes, we offer online computer classes.",
//       "Yes, we teach basic video editing techniques.",
//       "Yes, we teach digital marketing fundamentals.",
//       "Yes, we cover on-page SEO basics.",
//       "Yes, we help connect outstanding students with internships.",
//       "Yes, students may bring their own laptops if they prefer.",
//       "Yes, we provide recordings of online sessions.",
//       "Yes, evening batches are available.",
//       "Yes, weekend batches are available, along with evening shift classes, depending on student needs and availability.",
//       "It is affordable; please contact us directly for specific course fees.",
//       "Yes, we provide discounts when you enroll in multiple courses.",
//       "Yes, we teach Canva for quick design creation.",
//       "Yes, we administer internal certification exams upon course completion.",
//       "Yes, we guide our students through the process of online earning.",
//       "Yes, practical assignments are given to assess student learning.",
//       "Yes, we assist deserving students with job and internship placement.",
//       "Yes, school students are welcome to join our computer courses.",
//       "Separate batches are available for females and males.",
//       "You can visit our campus or contact us at 0321-4712207, 0303-3569000, 0304-4230664, 0304-4641590(Heir), 0303-4027152(Heir) to complete your enrollment.",
//     ],
//   },
//   {
//     id: 4,
//     label: "4. Soft Skills Courses",
//     icon: "🧠",
//     headerBg: "bg-orange-600",
//     viewAllColor: "text-orange-600",
//     total: 40,
//     ellipsisAfter: 4,
//     questions: [
//       "101. What are soft skills courses?",
//       "102. Why are soft skills important?",
//       "103. What soft skills do you teach?",
//       "104. Do you offer communication skills training?",
//       "105. Do you teach public speaking?",
//       "106. Do you offer personality development courses?",
//       "107. Do you teach leadership skills?",
//       "108. Do you offer confidence-building sessions?",
//       "109. Do you teach interview skills?",
//       "110. Do you offer English speaking courses?",
//       "111. Are these courses suitable for beginners?",
//       "112. Do you offer group discussions?",
//       "113. Are role-play activities included?",
//       "114. Do you provide certificates?",
//       "115. What is the course duration?",
//       "116. Are these courses for students only?",
//       "117. Can professionals join?",
//       "118. Do you offer corporate training?",
//       "119. Do you provide practical exercises?",
//       "120. Are trainers experienced?",
//       "121. Do you offer one-on-one coaching?",
//       "122. Do you teach time management?",
//       "123. Do you teach goal setting?",
//       "124. Do you offer motivational sessions?",
//       "125. Do you teach teamwork skills?",
//       "126. Are confidence assessments done?",
//       "127. Do you offer stage practice?",
//       "128. Are presentations part of training?",
//       "129. Do you offer accent training?",
//       "130. Do you help overcome fear of speaking?",
//       "131. Are classes interactive?",
//       "132. Do you provide feedback sessions?",
//       "133. Do you offer online soft skills courses?",
//       "134. Can teenagers join these courses?",
//       "135. Do you offer female-focused sessions?",
//       "136. Do you teach emotional intelligence?",
//       "137. Do you provide real-life scenarios?",
//       "138. Do you offer certification tests?",
//       "139. Do you provide career coaching?",
//       "140. How do I enroll in soft skills courses?",
//     ],
//     answers: [
//       "Soft skills courses train you in communication, teamwork, leadership, and other personal skills that help you succeed in jobs, interviews, and daily life.",
//       "85% of job success comes from soft skills. Employers hire people who can communicate, lead, solve problems, and work in teams — not just technical skills.",
//       "We cover: communication, public speaking, leadership, confidence building, interview skills, time management, goal setting, teamwork, and English speaking.",
//       "Yes. We have dedicated modules for verbal, non-verbal, written, and presentation skills with daily speaking practice.",
//       "Yes. You'll learn stage confidence, speech writing, voice control, and body language through live practice sessions.",
//       "Yes. Our personality development program covers grooming, etiquette, confidence, attitude building, and personal branding.",
//       "Yes. Learn team management, decision-making, problem-solving, and how to motivate others through case studies + activities.",
//       "Yes. Every class includes confidence activities like role-plays, debates, presentations, and positive mindset training.",
//       "Yes. We cover CV making, common Q&A, mock interviews, dress code, and how to handle stress in interviews.",
//       "Yes. Basic to advanced spoken English with grammar, vocabulary, fluency drills, and conversation practice.",
//       "Yes. We start from basics. No prior experience needed. Batches are divided by level.",
//       "Yes. Weekly group discussions are conducted on age-appropriate topics, current affairs, and classroom subjects to improve students' thinking, confidence, and speaking skills.",
//       "Yes. Role-play activities like classroom presentations, teamwork scenarios, and real-life situations are included in every module to build communication and problem-solving skills",
//       "Yes. You get a Meridians Group of Education certificate after completing the course + passing assessment. Our institution affiliated with Lahore board and registered from government of Punjab.",
//       "Course duration 2 month to 6 month....each course have different duration....duration depends on course title.",
//       "No. Students, job seekers, professionals, and housewives can all join. We have separate batches by age/profession.",
//       "Yes. We have evening + weekend batches designed for working professionals.",
//       "Yes. We provide customized soft skills training for companies, offices, and teams at your location or ours.",
//       "Yes. 70% of class time is practical: speeches, GDs, presentations, games, and real-life tasks. Only 30% theory.",
//       "Yes. Our trainers have 5+ years experience in corporate training, HR, and communication. Many are certified professionals.",
//       "Yes. Personal coaching is available for interview prep, public speaking fear, and leadership at extra cost.",
//       "Yes. Learn priority setting, avoiding procrastination, daily planning, and work-life balance techniques.",
//       "Yes. We use SMART goals method + vision boards to help you set and achieve personal/professional goals.",
//       "Yes. Every course includes motivational talks, success stories, and mindset training to keep you focused.",
//       "Yes. Through group projects, team games, and collaboration activities that build coordination and leadership.",
//       "Yes. We do a confidence check on day 1 and again at course end to track your improvement with scores and trainer feedback.",
//       "Yes. Dedicated stage with mic, podium, and audience setup. Every student practices speeches on stage weekly.",
//       "Yes. You'll prepare and deliver 4–6 presentations during the course on different topics to build real confidence.",
//       "Yes. Neutral accent and pronunciation training is included in our English speaking + communication modules.",
//       "Yes. Step-by-step fear removal through breathing techniques, small group talks, then stage practice. We specialize in this.",
//       "Yes. No boring lectures. Classes are 70% activities: debates, games, role-plays, discussions, and peer feedback.",
//       "Yes. After every speech/GD, trainers give 1-on-1 feedback on strengths + areas to improve.",
//       "Yes. Live Zoom classes with same activities, recordings, and personal feedback available for online students.",
//       "Yes. We have special batches for ages 14–19 focused on confidence, career, and exam interview skills.",
//       "Yes. Separate female-only batches with female trainers available for comfort and safety.",
//       "Yes. Modules on self-awareness, empathy, handling stress, and managing relationships are part of advanced courses.",
//       "Yes. We use workplace, interview, and social situations for role-plays so you learn skills you'll actually use.",
//       "Yes. Final assessment includes written + practical test. Pass to get your Meridians certificate.",
//       "Yes. 1-on-1 sessions for career selection, CV review, and job search strategy are included in advanced programs.",
//       "Same as other courses: Visit campus/call/WhatsApp → choose batch → fill form → submit CNIC copy + photos → pay fee to start.",
//     ],
//   },
//   {
//     id: 5,
//     label: "5. Admissions & Fees",
//     icon: "💰",
//     headerBg: "bg-yellow-600",
//     viewAllColor: "text-yellow-600",
//     total: 30,
//     ellipsisAfter: 4,
//     questions: [
//       "141. How can I apply for admission?",
//       "142. What documents are required?",
//       "143. Is there an admission fee?",
//       "144. What is the monthly fee structure?",
//       "145. Do you offer installment plans?",
//       "146. Are there any discounts available?",
//       "147. Do siblings get fee discounts?",
//       "148. Is there a refund policy?",
//       "149. What payment methods are accepted?",
//       "150. Are there scholarships available?",
//       "151. Do you charge separately for materials?",
//       "152. Are there hidden charges?",
//       "153. Can I pay online?",
//       "154. What happens if I miss a payment?",
//       "155. Do you offer trial classes before payment?",
//       "156. Can I switch courses after admission?",
//       "157. Do you offer combo packages?",
//       "158. Is admission open all year?",
//       "159. Are there limited seats?",
//       "160. Do you offer early bird discounts?",
//       "161. Can international students apply?",
//       "162. Do you offer group discounts?",
//       "163. Is registration mandatory?",
//       "164. Do you provide fee receipts?",
//       "165. Can I transfer my admission?",
//       "166. Are fees refundable if I drop out?",
//       "167. Do you offer merit-based discounts?",
//       "168. Is there a late fee policy?",
//       "169. Can I pause my course?",
//       "170. How long does admission process take?",
//     ],
//     answers: [
//       "Online via website/WhatsApp or offline at campus. Form takes 5 mins. Our counselor will guide you.",
//       "CNIC/B-Form copy, 2 passport-size photos, and last academic certificate copy. Original CNIC for verification only.",
//       "Yes. One-time registration fee is charged at admission. It's separate from monthly course fee.",
//       "For fee details contact: 03214712207.",
//       "Yes. You can pay course fee in 2–3 installments. First installment at admission.",
//       "Yes. Early bird discount, group discount, and seasonal offers. Ask our counselor for current promotions.",
//       "For discount details contact: 03214712207",
//       "Fee is non-refundable after classes start. If you cancel before batch starts, 80% is refunded after deducting admin charges.",
//       "Cash, bank transfer, JazzCash, EasyPaisa, and debit/credit card at campus.",
//       "Yes. Merit-based scholarships for position holders and need-based aid for deserving students after interview.",
//       "No. Notes, handouts, and practice sheets are included in fee. Books if needed are charged separately.",
//       "No. We have 100% transparent fees. Only admission + monthly fee. No hidden costs.",
//       "Yes. Bank transfer, JazzCash, and EasyPaisa details are shared after form submission.",
//       "For this issue you can contact admin office immediately.",
//       "Yes. If you want more details, then you can visit our main office: Bhatta Chowk, Bedian Road, near GO Petrol Pump. Or contact: 03214712207.",
//       "If you have a proper solid reason for switching courses, then visit our office physically and provide details for the change. Within the 3 days, course switches are allowed with fee adjustment. After 3 days, transfer charges may apply.",
//       "Yes. Computer + Soft Skills combo has 20% discount vs separate enrollment.",
//       "Yes. New batches start every month. You can join anytime without waiting for semester.",
//       "Yes. 15–20 students per batch for personal attention. Seats filled first-come, first-served.",
//       "Yes. Enroll 10 days before batch starts and get 10% off on first month fee.",
//       "Yes. Online classes available worldwide. For campus, you'll need valid visa documentation.",
//       "Yes. 3+ friends joining together get 15% discount each.",
//       "Yes. Without registration + fee, seat is not confirmed.",
//       "Yes. Computerized receipt given for every payment for your record.",
//       "Yes. You can transfer to another person before classes start with Rs. 500 admin fee.",
//       "No refund after 1 week of classes. For medical emergencies, fee can be adjusted to next batch.",
//       "Yes. 80%+ marks in last exam = 15% discount. Bring mark sheet.",
//       "If you want to know about late fee policy you can contact the admin office.",
//       "Yes. 1-month freeze allowed for genuine reasons. You can rejoin next batch without extra fee.",
//       "10–15 minutes if you have documents ready. You can start class same day if batch is running.",
//     ],
//   },
//   {
//     id: 6,
//     label: "6. Facilities & Environment",
//     icon: "🏫",
//     headerBg: "bg-purple-700",
//     viewAllColor: "text-purple-700",
//     total: 20,
//     ellipsisAfter: 4,
//     questions: [
//       "171. Do you have air-conditioned classrooms?",
//       "172. Is there a computer lab?",
//       "173. Do you provide free Wi-Fi?",
//       "174. Are classrooms well-equipped?",
//       "175. Do you have CCTV security?",
//       "176. Is the environment safe for students?",
//       "177. Do you have separate seating arrangements?",
//       "178. Are classrooms cleaned regularly?",
//       "179. Do you have backup electricity?",
//       "180. Is parking available?",
//       "181. Do you have a waiting area for parents?",
//       "182. Are washrooms clean and maintained?",
//       "183. Do you have multimedia teaching tools?",
//       "184. Are projectors used in classes?",
//       "185. Do you provide drinking water?",
//       "186. Is there a library?",
//       "187. Do you offer study rooms?",
//       "188. Are emergency measures in place?",
//       "189. Is the institute noise-free?",
//       "190. Do you provide comfortable seating?",
//     ],
//     answers: [
//       "Yes. All classrooms are AC for comfort in summer.",
//       "Yes. Modern lab with latest PCs, high-speed internet, and 1:1 computer for each student.",
//       "Yes. Free high-speed Wi-Fi for all students during class hours.",
//       "Yes. Whiteboards, projectors, sound system, and proper lighting in every room.",
//       "Yes. 24/7 CCTV monitoring in all classrooms, labs, and corridors for safety.",
//       "Yes. Separate female staff, security guard, CCTV, and strict entry system ensure safety.",
//       "Yes. Option for separate male/female seating available on request.",
//       "Yes. Daily cleaning + sanitization before each batch.",
//       "Yes. UPS + generator ensure classes run during load shedding.",
//       "Yes. Free bike and car parking space for students.",
//       "Yes. Comfortable AC waiting lounge with seating and water for parents/guardians.",
//       "Yes. Separate, clean washrooms for males/females, cleaned multiple times daily.",
//       "Yes. Projectors, LEDs, speakers, and smart boards used for interactive learning.",
//       "Yes. Most lectures, presentations, and videos are delivered via projector.",
//       "Yes. Filtered water dispensers available on each floor.",
//       "Yes. Small reference library with career, IT, and soft skills books students can use.",
//       "Yes. Students can use empty classrooms for group study after class with permission.",
//       "Yes. Fire extinguishers, first aid box, and emergency exits in the building.",
//       "Yes. Soundproof classrooms away from main road to avoid disturbance.",
//       "Yes. Cushioned chairs and proper desks for long classes.",
//     ],
//   },
//   {
//     id: 7,
//     label: "7. Career & Results",
//     icon: "🎯",
//     headerBg: "bg-pink-600",
//     viewAllColor: "text-pink-600",
//     total: 10,
//     ellipsisAfter: 3,
//     isTwoCol: true,
//     questions: [
//       "191. Do you help students choose",
//       "192. What are your student success",
//       "193. Do you offer job placement",
//       "194. Do you provide internship",
//       "195. How do your courses improve employability?",
//       "196. Do you guide students for freelancing?",
//       "197. Are alumni connected with the institute?",
//       "198. Do you provide recommendation letters?",
//       "199. How do you measure student success?",
//       "200. What opportunities can students expect after completing courses?",
//     ],
//     continuations: [
//       "careers?",
//       "stories?",
//       "support?",
//       "opportunities?",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//     ],
//     answers: [
//       "Yes. Free career counseling session with aptitude test to guide you to the right field.",
//       "Our students are now in banks, MNCs, IT companies, and own businesses. Check our social media for video testimonials.",
//       "Yes. We share CVs with partner companies, conduct job fairs, and prep you for interviews. No fake job guarantee.",
//       "Yes. Top students get internships at local companies through our network.",
//       "We teach what companies actually want: communication, MS Office, confidence, and interview skills — not just theory.",
//       "Yes. Special sessions on Fiverr, Upwork, and freelancing skills in IT + content writing courses.",
//       "Yes. Active alumni WhatsApp group for networking, job sharing, and meetups.",
//       "Yes. Top performers get signed recommendation letters for jobs/university applications.",
//       "Through assessments, presentation marks, attendance, mock interviews, and final practical test.",
//       "Better jobs, promotions, freelancing income, university admission success, and confidence to start business or speak publicly.",
//     ],
//   },
// ];

// // const menuItems = [
// //   { icon: "🏛️", label: "1. General Information" },
// //   { icon: "🎓", label: "2. Academic Programs (PG–12)" },
// //   { icon: "💻", label: "3. Computer Courses" },
// //   { icon: "🧠", label: "4. Soft Skills Courses" },
// //   { icon: "💰", label: "5. Admissions & Fees" },
// //   { icon: "🏫", label: "6. Facilities & Environment" },
// //   { icon: "🎯", label: "7. Career & Results" },
// //   { icon: "ℹ️", label: "8. Talk to Counselor" },
// // ];

// const quickActions = [
//   { icon: "🎓", label: "Courses Offered" },
//   { icon: "💰", label: "Fee Structure" },
//   { icon: "📋", label: "Admissions" },
//   { icon: "⏰", label: "Timings" },
//   { icon: "📍", label: "Location" },
//   { icon: "🎧", label: "Talk to Counselor" },
// ];

// /* ─────────────────────────────────────────────
//    CATEGORY CARD COMPONENT
// ───────────────────────────────────────────── */
// interface CatCardProps {
//   cat: any;
//   onViewAll: (c: any) => void;
//   onQClick: (c: any, qi: number) => void;
// }

// function CatCard({ cat, onViewAll, onQClick }: CatCardProps) {
//   return (
//     <div className="flex flex-col rounded-lg border border-gray-200 overflow-hidden">
//       {/* Header */}
//       <div className={`${cat.headerBg} flex items-center gap-1.5 px-2.5 py-1.5 text-white font-extrabold text-[10px] uppercase tracking-wide`}>
//         <span className="text-[13px]">{cat.icon}</span>
//         <span>{cat.label}</span>
//       </div>

//       {/* Body */}
//       <div className={`flex-1 bg-white px-2.5 py-1.5 ${cat.isTwoCol ? "grid grid-cols-2 gap-x-2" : ""}`}>
//         {cat.isTwoCol ? (
//           <>
//             <div>
//               {cat.questions.slice(0, cat.ellipsisAfter).map((q: string, i: number) => (
//                 <div
//                   key={i}
//                   style={{ cursor: "pointer" }}
//                   onClick={() => onQClick(cat, i)}
//                   className="text-blue-900 text-[10px] py-0.5 border-b border-gray-100 leading-snug hover:text-blue-600 transition-colors"
//                 >
//                   {q}
//                 </div>
//               ))}
//               {cat.questions.slice(4).map((q: string, i: number) => (
//                 <div
//                   key={i + 4}
//                   style={{ cursor: "pointer" }}
//                   onClick={() => onQClick(cat, i + 4)}
//                   className="text-blue-900 text-[10px] py-0.5 border-b border-gray-100 leading-snug hover:text-blue-600 transition-colors"
//                 >
//                   {q}
//                 </div>
//               ))}
//             </div>
//             <div>
//               {(cat.continuations || []).map((c: string, i: number) => (
//                 <div key={i} style={{ color: "#888" }} className="text-gray-400 text-[10px] py-0.5 border-b border-gray-100 leading-snug">
//                   {c}
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <>
//             {cat.questions.slice(0, cat.ellipsisAfter).map((q: string, i: number) => (
//               <div
//                 key={i}
//                 style={{ cursor: "pointer" }}
//                 onClick={() => onQClick(cat, i)}
//                 className="text-blue-900 text-[10px] py-0.5 border-b border-gray-100 leading-snug hover:text-blue-600 transition-colors"
//               >
//                 {q}
//               </div>
//             ))}
//             {cat.questions.slice(cat.ellipsisAfter).map((q: string, i: number) => (
//               <div
//                 key={i + cat.ellipsisAfter}
//                 style={{ cursor: "pointer" }}
//                 onClick={() => onQClick(cat, i + cat.ellipsisAfter)}
//                 className="text-blue-900 text-[10px] py-0.5 border-b border-gray-100 leading-snug hover:text-blue-600 transition-colors"
//               >
//                 {q}
//               </div>
//             ))}
//           </>
//         )}
//       </div>

//       {/* View All Button */}
//       <button
//         onClick={() => onViewAll(cat)}
//         className={`w-full flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 border-t border-gray-200 bg-white hover:bg-gray-50 transition-colors ${cat.viewAllColor}`}
//       >
//         View all {cat.total} questions <span>›</span>
//       </button>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    MODAL COMPONENT
// ───────────────────────────────────────────── */
// function Modal({ cat, qIndex, onClose }: { cat: any; qIndex: number | null; onClose: () => void }) {
//   const [activeQ, setActiveQ] = useState(qIndex ?? null);
//   if (!cat) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-5 shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Modal Header */}
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-2">
//             <span className="text-xl">{cat.icon}</span>
//             <span className={`font-extrabold text-sm ${cat.viewAllColor}`}>{cat.label}</span>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg font-bold leading-none">
//             ✕
//           </button>
//         </div>

//         {/* Questions Accordion */}
//         <div className="flex flex-col gap-6">
//           {cat.questions.map((q: string, i: number) => (
//             <div
//               key={i}
//               className={`rounded-lg border overflow-hidden ${activeQ === i ? "border-blue-400" : "border-gray-200"}`}
//             >
//               <div
//                 onClick={() => setActiveQ(activeQ === i ? null : i)}
//                 className={`flex items-center justify-between px-3 py-2 text-[11px] font-bold cursor-pointer transition-colors ${
//                   activeQ === i
//                     ? `${cat.headerBg} text-white`
//                     : "bg-gray-50 text-blue-900 hover:bg-blue-50"
//                 }`}
//               >
//                 <span>{q}{cat.continuations?.[i] ? " " + cat.continuations[i] : ""}</span>
//                 <span className="ml-2 shrink-0">{activeQ === i ? "▲" : "▼"}</span>
//               </div>
//               {activeQ === i && (
//                 <div className="px-3 py-2 text-[11px] text-gray-600 leading-relaxed bg-white">
//                   {cat.answers[i]}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────
//    MAIN PAGE COMPONENT
// ───────────────────────────────────────────── */
// export default function MeridiansChatbotPage() {
//   const [modal, setModal] = useState<{ cat: any; qIndex: number | null }>({ cat: null, qIndex: null });

//   const openModal = (cat: any, qIndex: number | null = null) => setModal({ cat, qIndex });
//   const closeModal = () => setModal({ cat: null, qIndex: null });

//   const row1 = categories.slice(0, 3);
//   const row2 = categories.slice(3, 6);
//   const career = categories[6];

//   return (
//     <div className="bg-slate-100 p-3 min-w-[900px] font-sans">

//       {/* ══════════════════ TOP HEADER ══════════════════ */}
//       {/* <div className="bg-white rounded-t-xl px-5 py-2.5 flex items-center justify-between border-b-2 border-gray-200">
//         <div>
//           <div className="text-2xl font-black text-[#1a3a6e] leading-none">MERIDIANS</div>
//           <div className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">
//             Group of Education
//           </div>
//         </div>
//         <div className="text-[11px] text-gray-600 text-right leading-7">
//           <div>🌐 www.meridiansedu.com</div>
//           <div>✉️ info@meridiansedu.com</div>
//         </div>
//       </div> */}

//       {/* ══════════════════ MIDDLE: SIDEBAR + CONTENT ══════════════════ */}
//       <div className="bg-white flex">

//         {/* ── SIDEBAR ── */}
        

//         {/* ── CONTENT: Category Grids ── */}
//         <div className="flex-1 p-2.5 min-w-0 flex flex-col gap-2">

//           {/* Row 1 — 3 columns */}
//           <div className="grid grid-cols-3 gap-2">
//             {row1.map((cat) => (
//               <CatCard
//                 key={cat.id}
//                 cat={cat}
//                 onViewAll={(c) => openModal(c)}
//                 onQClick={(c, qi) => openModal(c, qi)}
//               />
//             ))}
//           </div>

//           {/* Row 2 — 3 columns */}
//           <div className="grid grid-cols-3 gap-2">
//             {row2.map((cat) => (
//               <CatCard
//                 key={cat.id}
//                 cat={cat}
//                 onViewAll={(c) => openModal(c)}
//                 onQClick={(c, qi) => openModal(c, qi)}
//               />
//             ))}
//           </div>

//           {/* Row 3 — Career (wider) + Talk to Counselor */}
//           <div className="grid gap-2" style={{ gridTemplateColumns: "3fr 2fr" }}>

//             {/* Career & Results card */}
//             <CatCard
//               cat={career}
//               onViewAll={(c) => openModal(c)}
//               onQClick={(c, qi) => openModal(c, qi)}
//             />

//             {/* Talk to Counselor box */}
//             {/* <div className="flex flex-col rounded-lg border border-blue-200 bg-blue-50 p-3">
//               <div className="flex items-center gap-1.5 font-extrabold text-cyan-600 text-[11px] mb-2">
//                 <span className="text-base">🎧</span>
//                 <span>8. TALK TO COUNSELOR</span>
//               </div>
//               <p className="text-blue-900 font-semibold text-[11px] mb-2.5 leading-snug">
//                 Would you like to connect with our admission counselor?
//               </p>
//               <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-md mb-1.5 text-[11px] transition-colors w-full">
//                 📞 Call Us
//               </button>
//               <a href="https://wa.me/923214712207" className="no-underline w-full">
//                 <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-3 rounded-md mb-1.5 text-[11px] transition-colors w-full">
//                   💬 Chat on WhatsApp
//                 </button>
//               </a>
//               <button className="flex items-center gap-1.5 bg-white hover:bg-blue-50 text-blue-800 border border-blue-400 font-bold py-1.5 px-3 rounded-md text-[11px] transition-colors w-full">
//                 📩 Leave a Message
//               </button>
//               <p className="text-gray-500 text-[10px] mt-2">Our team will guide you personally.</p>
//             </div> */}

//           </div>
//         </div>
//       </div>

//       {/* ══════════════════ FULL WIDTH BOTTOM ══════════════════ */}
//       {/* <div className="bg-white rounded-b-xl border-t border-gray-200 p-3 flex flex-col gap-2">

       
//         <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
//           <div className="text-[10px] font-black text-[#1a3a6e] mb-1.5">
//             QUICK ACTIONS{" "}
//             <span className="font-normal text-gray-500">(At any time, user can type or click)</span>
//           </div>
//           <div className="flex flex-wrap gap-1.5">
//             {quickActions.map((a) => (
//               <button
//                 key={a.label}
//                 className="flex items-center gap-1 bg-white border border-blue-200 rounded-full px-3 py-1 text-[10.5px] font-bold text-[#1a3a6e] hover:bg-blue-100 transition-colors"
//               >
//                 {a.icon} {a.label}
//               </button>
//             ))}
//           </div>
//         </div>

        
//         <div className="grid grid-cols-2 gap-2">
//           <div className="flex gap-2.5 items-start border border-gray-200 rounded-lg p-3 bg-white">
//             <span className="text-2xl shrink-0">🤖</span>
//             <div className="text-[10.5px] text-gray-600 leading-relaxed">
//               <strong className="text-[#1a3a6e] text-[11px] block mb-1">STILL NEED HELP?</strong>
//               I didn't quite get that. Please choose a topic from the menu or type your question in simple words. I'm here to help!
//               <div className="text-[9px] text-gray-400 mt-1.5">10:00 AM</div>
//             </div>
//           </div>
//           <div className="flex gap-2.5 items-start border border-gray-200 rounded-lg p-3 bg-white">
//             <span className="text-2xl shrink-0">🎧</span>
//             <div className="text-[10.5px] text-gray-600 leading-relaxed">
//               <strong className="text-[#1a3a6e] text-[11px] block mb-1">HANDOVER TO HUMAN AGENT</strong>
//               Sure! Connecting you with our counselor.
//               <br />
//               Please wait a moment…
//               <div className="text-base text-blue-500 mt-1 tracking-[3px]">• • •</div>
//               <div className="text-[9px] text-gray-400">10:00 AM</div>
//             </div>
//           </div>
//         </div>

        
//         <div className="flex gap-2 items-start bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-[10px] text-yellow-900">
//           <span className="text-lg shrink-0">⭐</span>
//           <div>
//             <strong className="text-yellow-800 block mb-0.5">NOTE TO WEBSITE OWNER</strong>
//             This chatbot script is designed to help visitors quickly find answers from 200 FAQs across all major areas.
//             You can connect it to WhatsApp Business API / Live Chat / CRM for better lead management.
//           </div>
//         </div>

//       </div> */}

      
//       {modal.cat && (
//         <Modal cat={modal.cat} qIndex={modal.qIndex} onClose={closeModal} />
//       )}
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import type { CSSProperties } from "react";

/* ─────────────────────────────────────────────
   DATA (UPDATED WITH ALL NEW Q&A)
───────────────────────────────────────────── */
const categories = [
  {
    id: 1,
    label: "1. General Information",
    icon: "🏛️",
    headerBg: "bg-blue-600",
    viewAllColor: "text-blue-600",
    total: 20,
    ellipsisAfter: 4,
    questions: [
      "1. What is Meridians Group of Education?",
      "2. Where is your institute located?",
      "3. What programs do you offer?",
      "4. What age groups do you cater to?",
      "5. Do you offer both academic and skill-based courses?",
      "6. What makes your institute different from others?",
      "7. Are your courses certified?",
      "8. Do you offer online classes?",
      "9. What are your operating hours?",
      "10. How can I contact your institute?",
      "11. Do you have multiple branches?",
      "12. What is your mission and vision?",
      "13. Who are your instructors?",
      "14. Do you offer counseling before admission?",
      "15. Is your institute registered?",
      "16. Do you provide career guidance?",
      "17. Can parents visit the institute?",
      "18. Do you have a website and social media pages?",
      "19. How long have you been operating?",
      "20. Do you offer trial classes?",
    ],
    answers: [
      "It is an educational and skill-development institute offering academic tutoring, digital skills, and professional IT courses.",
      "Main Campus: Bhatta Chowk Bedian Road, near Go Petrol Pump, Lahore. Branch#2: Amjad Colony, Tatla Road I, Heir Lahore. Branch#3: Bedian Road, Alfalfa Town near Touheed Mart, Lahore.",
      "We offer classes from Playgroup to Intermediate.",
      "We cater to kids, young students, and adults.",
      "Yes, we offer both academic tuitions and skill-based IT/professional courses.",
      "We focus on conceptual learning, small class sizes, and practical, project-based training.",
      "Yes, Our institution is affiliated with the board, so students receive regular degrees. We also provide proper certification for all skill-based courses.",
      "Yes, we offer online classes for academic.",
      "7:30 am to 1pm (morning) and 3:45 pm to 8.30 pm (evening)",
      "You can call us at 0321-4712207, 0303-3569000, 0304-4230664, 0304-4641590(Heir), 0303-4027152(Heir) or visit our campus.",
      "Yes, we have multiple branches in Lahore. Main Campus: Bhatta Chowk Bedian Road, near Go Petrol Pump, Lahore - Branch#2: Amjad Colony, Tatla Road I, Heir Lahore - Branch#3: Bedian Road, Alfalfa Town near Touheed Mart, Lahore",
      "To bridge learning gaps, foster conceptual understanding, and equip students with modern skills.",
      "Qualified subject specialists and expert IT instructors.",
      "Yes, counseling is provided to help students select the right program.",
      "Yes, our institution is affiliated with Lahore board and registered from government of Punjab.",
      "Yes, we provide career, academic, and freelancing guidance.",
      "Yes, parents are welcome to visit during operating hours.",
      "Yes, we maintain an active online presence.",
      "We have been successfully operating since 2004, delivering quality education and strong results.",
      "Yes, trial classes are available for new enrollments.",
    ],
  },
  {
    id: 2,
    label: "2. Academic Programs (PG–12)",
    icon: "🎓",
    headerBg: "bg-teal-600",
    viewAllColor: "text-teal-600",
    total: 40,
    ellipsisAfter: 4,
    questions: [
      "21. Do you offer classes for Playgroup (PG)?",
      "22. What subjects are taught at primary level?",
      "23. Do you follow any specific board (Punjab, Cambridge, etc.)?",
      "24. Do you prepare students for board exams?",
      "25. Are your teachers subject specialists?",
      "26. Do you provide homework support?",
      "27. How do you track student progress?",
      "28. Are monthly tests conducted?",
      "29. Do you offer crash courses for exams?",
      "30. Can weak students get extra support?",
      "31. Do you provide notes and study material?",
      "32. Are small class sizes maintained?",
      "33. Do you offer science and arts streams?",
      "34. Are practicals included for science students?",
      "35. Do you help with assignment preparation?",
      "36. Do you offer revision classes?",
      "37. What is your pass success rate?",
      "38. Do you offer weekend classes?",
      "39. Can students switch batches?",
      "40. Do you offer O-Level/Matric support?",
      "41. Do you teach English medium students?",
      "42. Do you offer Urdu medium support?",
      "43. How do you handle slow learners?",
      "44. Do you provide one-on-one tutoring?",
      "45. Are there quizzes and activities?",
      "46. Do you prepare students for entry tests?",
      "47. Do you offer summer school programs?",
      "48. Are parents updated regularly?",
      "49. Do you provide progress reports?",
      "50. Do you focus on conceptual learning?",
      "51. Do you offer group study sessions?",
      "52. Can students repeat classes?",
      "53. Do you teach Islamic studies?",
      "54. Do you offer computer basics to school students?",
      "55. Are co-curricular activities included?",
      "56. Do you help in exam strategy?",
      "57. Are classes interactive?",
      "58. Do you provide exam past papers?",
      "59. Do you teach spoken English alongside academics?",
      "60. Are there separate batches for girls and boys?",
    ],
    answers: [
      "Yes, we offer kindergarten classes along with daycare facilities. We accept children above 1 year of age and provide a safe, caring, and learning-friendly environment where they can grow, play, and develop basic skills under proper supervision.",
      "Math, English, Urdu, Science, Nazra and computer basics.",
      "We support Punjab Board systems.",
      "Yes, we prepare students for Matric and FSc/Intermediate board exams with a well-planned and student-friendly approach. We focus on concept-based learning, regular revision, and organized test sessions to help students stay confident and fully prepared for their exams.",
      "Yes, all academic subjects are taught by qualified specialists.",
      "Yes, we assist students with their daily school assignments and homework.",
      "Progress is tracked through weekly test, monthly Assessments, quizzes, and regular reporting.",
      "Yes, monthly tests are conducted to assess performance.",
      "Yes, crash courses are offered for quick and efficient exam preparation.",
      "Yes, we provide one-on-one attention and extra tutoring for weaker students.",
      "Yes, we provide comprehensive study materials and notes.",
      "Yes, small class sizes ensure individual attention.",
      "Yes, we offer both Science and Arts streams. Students are guided according to their chosen field, and we also provide opportunities like science fairs and arts exhibitions where they can showcase their creativity, projects, and skills in a practical and confident way.",
      "Yes, we provide full guidance and support for science practicals. Students are properly taught and their practicals are performed under supervision to help them understand concepts in a clear and hands-on way.",
      "Yes, we assist with academic assignments.",
      "Yes, we conduct revision classes prior to exams.",
      "Our result is consistently excellent, with 100% pass rate, and most students easily achieve 90% marks or above.",
      "Yes, we also offer weekend classes on a conditional basis, depending on student need and availability.",
      "Yes, students can switch batches subject to availability.",
      "We offer comprehensive support for Matric examinations.",
      "Yes, we teach English medium students.",
      "Yes, we provide support in Urdu as well.",
      "Through extra time, remedial classes, and personalized attention.",
      "Yes, we offer one-on-one tutoring upon request.",
      "Yes, quizzes and activities are included to keep learning engaging.",
      "Yes, we help prepare students for college and university entry tests, including all entry tests such as MDCAT, ECAT, and others.",
      "Yes, we conduct a proper summer school program, including regular summer classes and a fun-filled Summer Fiesta, where students learn new skills along with engaging and creative activities.",
      "Yes, we keep parents regularly updated about student progress through parent app, SMS alerts, and other communication platforms to ensure better coordination and transparency.",
      "Yes, progress reports are shared with parents.",
      "Yes, conceptual clarity is the core focus of our teaching.",
      "Yes, we facilitate collaborative study sessions.",
      "Yes, students can repeat classes/grades if necessary.",
      "Yes, Islamiyat is taught as an important part of the curriculum, including Nazra-e-Quran and basic Islamic education. We focus on moral values, proper understanding, and character building in a simple and meaningful way.",
      "Yes, we offer computer basics for young students.",
      "Yes, we integrate co-curricular activities for the holistic development of students. These include educational tours, science and arts exhibitions, annual celebrations, and various other school activities. All these programs help students build confidence, improve creativity, and develop teamwork and communication skills along with their studies.",
      "Yes, we teach students how to manage their time and answer effectively during exams.",
      "Yes, our classes are interactive and engaging.",
      "Yes, we provide and review past papers.",
      "Yes, we help students improve their spoken English through a specially designed course. In this program, students practice daily speaking, vocabulary building, pronunciation, and conversation skills in a friendly environment. We focus on boosting confidence so students can speak English fluently in both academic and real-life situations.",
      "Yes, separate batches are available for boys and girls.",
    ],
  },
  {
    id: 3,
    label: "3. Computer Courses",
    icon: "💻",
    headerBg: "bg-green-600",
    viewAllColor: "text-green-600",
    total: 40,
    ellipsisAfter: 4,
    questions: [
      "61. What computer courses do you offer?",
      "62. Do you offer basic computer courses?",
      "63. What is included in basic IT training?",
      "64. Do you offer MS Office training?",
      "65. Do you teach Excel in detail?",
      "66. Do you offer graphic designing courses?",
      "67. Which software is taught in graphic design?",
      "68. Do you teach Adobe Photoshop?",
      "69. Do you offer web development courses?",
      "70. Do you teach HTML, CSS, JavaScript?",
      "71. Do you offer programming courses?",
      "72. Which programming languages are taught?",
      "73. Do you offer freelancing courses?",
      "74. Do you teach Fiverr and Upwork skills?",
      "75. Are practical projects included?",
      "76. Do you students get certificates after completion?",
      "77. What is the duration of computer courses?",
      "78. Are classes beginner-friendly?",
      "79. Do you provide lab facilities?",
      "80. Can I take classes without prior experience?",
      "81. Do you offer advanced IT courses?",
      "82. Are online computer classes available?",
      "83. Do you teach video editing?",
      "84. Do you offer digital marketing courses?",
      "85. Do you teach SEO basics?",
      "86. Do you provide internship opportunities?",
      "87. Can students bring their own laptops?",
      "88. Are recordings provided for online classes?",
      "89. Do you offer evening classes?",
      "90. Are weekend batches available?",
      "91. What is the fee structure?",
      "92. Do you offer discounts on multiple courses?",
      "93. Do you teach Canva tools?",
      "94. Do you offer certification exams?",
      "95. Do you help students earn online?",
      "96. Are assignments given in courses?",
      "97. Do you provide job placement support?",
      "98. Can school students join computer courses?",
      "99. Do you offer female-only batches?",
      "100. How do I enroll in a computer course?",
    ],
    answers: [
      "MS Office, Graphic Design, Web Development, Programming, Video Editing, and Digital Marketing.",
      "Yes, we offer a fundamental computer course for beginners.",
      "Typing, basic Windows navigation, and introductory software use.",
      "Yes, we offer training in MS Word, Excel, and PowerPoint.",
      "Yes, we cover basic and advanced Excel functions.",
      "Yes, we offer graphic design courses using industry-standard tools.",
      "Adobe Photoshop and Canva.",
      "Yes, we teach photo editing and graphic creation.",
      "Yes, we offer foundational web development training.",
      "Yes, we cover the fundamentals of HTML, CSS, and JavaScript.",
      "Yes, we teach introductory programming languages.",
      "Languages such as Python and basic C++.",
      "Yes, we offer training on how to use freelancing platforms.",
      "Yes, we teach profile creation, gig optimization, and bid writing.",
      "Yes, hands-on projects are part of all computer courses.",
      "Yes, certificates are provided upon completion.",
      "Courses are available with different durations depending on the program, ranging from 4 weeks to 6 months. Each course is designed according to its level and learning requirements to ensure proper understanding and skill development.",
      "Yes, we start from basics, so beginners can learn easily.",
      "Yes, fully equipped computer lab facilities are available with modern systems and smart board technology to provide an interactive and effective learning environment.",
      "Yes, our courses are designed for absolute beginners.",
      "Yes, advanced modules are available based on skill level.",
      "Yes, we offer online computer classes.",
      "Yes, we teach basic video editing techniques.",
      "Yes, we teach digital marketing fundamentals.",
      "Yes, we cover on-page SEO basics.",
      "Yes, we help connect outstanding students with internships.",
      "Yes, students may bring their own laptops if they prefer.",
      "Yes, we provide recordings of online sessions.",
      "Yes, evening batches are available.",
      "Yes, weekend batches are available, along with evening shift classes, depending on student needs and availability.",
      "It is affordable; please contact us directly for specific course fees.",
      "Yes, we provide discounts when you enroll in multiple courses.",
      "Yes, we teach Canva for quick design creation.",
      "Yes, we administer internal certification exams upon course completion.",
      "Yes, we guide our students through the process of online earning.",
      "Yes, practical assignments are given to assess student learning.",
      "Yes, we assist deserving students with job and internship placement.",
      "Yes, school students are welcome to join our computer courses.",
      "Separate batches are available for females and males.",
      "You can visit our campus or contact us at 0321-4712207, 0303-3569000, 0304-4230664, 0304-4641590(Heir), 0303-4027152(Heir) to complete your enrollment.",
    ],
  },
  {
    id: 4,
    label: "4. Soft Skills Courses",
    icon: "🧠",
    headerBg: "bg-orange-600",
    viewAllColor: "text-orange-600",
    total: 40,
    ellipsisAfter: 4,
    questions: [
      "101. What are soft skills courses?",
      "102. Why are soft skills important?",
      "103. What soft skills do you teach?",
      "104. Do you offer communication skills training?",
      "105. Do you teach public speaking?",
      "106. Do you offer personality development courses?",
      "107. Do you teach leadership skills?",
      "108. Do you offer confidence-building sessions?",
      "109. Do you teach interview skills?",
      "110. Do you offer English speaking courses?",
      "111. Are these courses suitable for beginners?",
      "112. Do you offer group discussions?",
      "113. Are role-play activities included?",
      "114. Do you provide certificates?",
      "115. What is the course duration?",
      "116. Are these courses for students only?",
      "117. Can professionals join?",
      "118. Do you offer corporate training?",
      "119. Do you provide practical exercises?",
      "120. Are trainers experienced?",
      "121. Do you offer one-on-one coaching?",
      "122. Do you teach time management?",
      "123. Do you teach goal setting?",
      "124. Do you offer motivational sessions?",
      "125. Do you teach teamwork skills?",
      "126. Are confidence assessments done?",
      "127. Do you offer stage practice?",
      "128. Are presentations part of training?",
      "129. Do you offer accent training?",
      "130. Do you help overcome fear of speaking?",
      "131. Are classes interactive?",
      "132. Do you provide feedback sessions?",
      "133. Do you offer online soft skills courses?",
      "134. Can teenagers join these courses?",
      "135. Do you offer female-focused sessions?",
      "136. Do you teach emotional intelligence?",
      "137. Do you provide real-life scenarios?",
      "138. Do you offer certification tests?",
      "139. Do you provide career coaching?",
      "140. How do I enroll in soft skills courses?",
    ],
    answers: [
      "Soft skills courses train you in communication, teamwork, leadership, and other personal skills that help you succeed in jobs, interviews, and daily life.",
      "85% of job success comes from soft skills. Employers hire people who can communicate, lead, solve problems, and work in teams — not just technical skills.",
      "We cover: communication, public speaking, leadership, confidence building, interview skills, time management, goal setting, teamwork, and English speaking.",
      "Yes. We have dedicated modules for verbal, non-verbal, written, and presentation skills with daily speaking practice.",
      "Yes. You'll learn stage confidence, speech writing, voice control, and body language through live practice sessions.",
      "Yes. Our personality development program covers grooming, etiquette, confidence, attitude building, and personal branding.",
      "Yes. Learn team management, decision-making, problem-solving, and how to motivate others through case studies + activities.",
      "Yes. Every class includes confidence activities like role-plays, debates, presentations, and positive mindset training.",
      "Yes. We cover CV making, common Q&A, mock interviews, dress code, and how to handle stress in interviews.",
      "Yes. Basic to advanced spoken English with grammar, vocabulary, fluency drills, and conversation practice.",
      "Yes. We start from basics. No prior experience needed. Batches are divided by level.",
      "Yes. Weekly group discussions are conducted on age-appropriate topics, current affairs, and classroom subjects to improve students' thinking, confidence, and speaking skills.",
      "Yes. Role-play activities like classroom presentations, teamwork scenarios, and real-life situations are included in every module to build communication and problem-solving skills",
      "Yes. You get a Meridians Group of Education certificate after completing the course + passing assessment. Our institution affiliated with Lahore board and registered from government of Punjab.",
      "Course duration 2 month to 6 month....each course have different duration....duration depends on course title.",
      "No. Students, job seekers, professionals, and housewives can all join. We have separate batches by age/profession.",
      "Yes. We have evening + weekend batches designed for working professionals.",
      "Yes. We provide customized soft skills training for companies, offices, and teams at your location or ours.",
      "Yes. 70% of class time is practical: speeches, GDs, presentations, games, and real-life tasks. Only 30% theory.",
      "Yes. Our trainers have 5+ years experience in corporate training, HR, and communication. Many are certified professionals.",
      "Yes. Personal coaching is available for interview prep, public speaking fear, and leadership at extra cost.",
      "Yes. Learn priority setting, avoiding procrastination, daily planning, and work-life balance techniques.",
      "Yes. We use SMART goals method + vision boards to help you set and achieve personal/professional goals.",
      "Yes. Every course includes motivational talks, success stories, and mindset training to keep you focused.",
      "Yes. Through group projects, team games, and collaboration activities that build coordination and leadership.",
      "Yes. We do a confidence check on day 1 and again at course end to track your improvement with scores and trainer feedback.",
      "Yes. Dedicated stage with mic, podium, and audience setup. Every student practices speeches on stage weekly.",
      "Yes. You'll prepare and deliver 4–6 presentations during the course on different topics to build real confidence.",
      "Yes. Neutral accent and pronunciation training is included in our English speaking + communication modules.",
      "Yes. Step-by-step fear removal through breathing techniques, small group talks, then stage practice. We specialize in this.",
      "Yes. No boring lectures. Classes are 70% activities: debates, games, role-plays, discussions, and peer feedback.",
      "Yes. After every speech/GD, trainers give 1-on-1 feedback on strengths + areas to improve.",
      "Yes. Live Zoom classes with same activities, recordings, and personal feedback available for online students.",
      "Yes. We have special batches for ages 14–19 focused on confidence, career, and exam interview skills.",
      "Yes. Separate female-only batches with female trainers available for comfort and safety.",
      "Yes. Modules on self-awareness, empathy, handling stress, and managing relationships are part of advanced courses.",
      "Yes. We use workplace, interview, and social situations for role-plays so you learn skills you'll actually use.",
      "Yes. Final assessment includes written + practical test. Pass to get your Meridians certificate.",
      "Yes. 1-on-1 sessions for career selection, CV review, and job search strategy are included in advanced programs.",
      "Same as other courses: Visit campus/call/WhatsApp → choose batch → fill form → submit CNIC copy + photos → pay fee to start.",
    ],
  },
  {
    id: 5,
    label: "5. Admissions & Fees",
    icon: "💰",
    headerBg: "bg-yellow-600",
    viewAllColor: "text-yellow-600",
    total: 30,
    ellipsisAfter: 4,
    questions: [
      "141. How can I apply for admission?",
      "142. What documents are required?",
      "143. Is there an admission fee?",
      "144. What is the monthly fee structure?",
      "145. Do you offer installment plans?",
      "146. Are there any discounts available?",
      "147. Do siblings get fee discounts?",
      "148. Is there a refund policy?",
      "149. What payment methods are accepted?",
      "150. Are there scholarships available?",
      "151. Do you charge separately for materials?",
      "152. Are there hidden charges?",
      "153. Can I pay online?",
      "154. What happens if I miss a payment?",
      "155. Do you offer trial classes before payment?",
      "156. Can I switch courses after admission?",
      "157. Do you offer combo packages?",
      "158. Is admission open all year?",
      "159. Are there limited seats?",
      "160. Do you offer early bird discounts?",
      "161. Can international students apply?",
      "162. Do you offer group discounts?",
      "163. Is registration mandatory?",
      "164. Do you provide fee receipts?",
      "165. Can I transfer my admission?",
      "166. Are fees refundable if I drop out?",
      "167. Do you offer merit-based discounts?",
      "168. Is there a late fee policy?",
      "169. Can I pause my course?",
      "170. How long does admission process take?",
    ],
    answers: [
      "Online via website/WhatsApp or offline at campus. Form takes 5 mins. Our counselor will guide you.",
      "CNIC/B-Form copy, 2 passport-size photos, and last academic certificate copy. Original CNIC for verification only.",
      "Yes. One-time registration fee is charged at admission. It's separate from monthly course fee.",
      "For fee details contact: 03214712207.",
      "Yes. You can pay course fee in 2–3 installments. First installment at admission.",
      "Yes. Early bird discount, group discount, and seasonal offers. Ask our counselor for current promotions.",
      "For discount details contact: 03214712207",
      "Fee is non-refundable after classes start. If you cancel before batch starts, 80% is refunded after deducting admin charges.",
      "Cash, bank transfer, JazzCash, EasyPaisa, and debit/credit card at campus.",
      "Yes. Merit-based scholarships for position holders and need-based aid for deserving students after interview.",
      "No. Notes, handouts, and practice sheets are included in fee. Books if needed are charged separately.",
      "No. We have 100% transparent fees. Only admission + monthly fee. No hidden costs.",
      "Yes. Bank transfer, JazzCash, and EasyPaisa details are shared after form submission.",
      "For this issue you can contact admin office immediately.",
      "Yes. If you want more details, then you can visit our main office: Bhatta Chowk, Bedian Road, near GO Petrol Pump. Or contact: 03214712207.",
      "If you have a proper solid reason for switching courses, then visit our office physically and provide details for the change. Within the 3 days, course switches are allowed with fee adjustment. After 3 days, transfer charges may apply.",
      "Yes. Computer + Soft Skills combo has 20% discount vs separate enrollment.",
      "Yes. New batches start every month. You can join anytime without waiting for semester.",
      "Yes. 15–20 students per batch for personal attention. Seats filled first-come, first-served.",
      "Yes. Enroll 10 days before batch starts and get 10% off on first month fee.",
      "Yes. Online classes available worldwide. For campus, you'll need valid visa documentation.",
      "Yes. 3+ friends joining together get 15% discount each.",
      "Yes. Without registration + fee, seat is not confirmed.",
      "Yes. Computerized receipt given for every payment for your record.",
      "Yes. You can transfer to another person before classes start with Rs. 500 admin fee.",
      "No refund after 1 week of classes. For medical emergencies, fee can be adjusted to next batch.",
      "Yes. 80%+ marks in last exam = 15% discount. Bring mark sheet.",
      "If you want to know about late fee policy you can contact the admin office.",
      "Yes. 1-month freeze allowed for genuine reasons. You can rejoin next batch without extra fee.",
      "10–15 minutes if you have documents ready. You can start class same day if batch is running.",
    ],
  },
  {
    id: 6,
    label: "6. Facilities & Environment",
    icon: "🏫",
    headerBg: "bg-purple-700",
    viewAllColor: "text-purple-700",
    total: 20,
    ellipsisAfter: 4,
    questions: [
      "171. Do you have air-conditioned classrooms?",
      "172. Is there a computer lab?",
      "173. Do you provide free Wi-Fi?",
      "174. Are classrooms well-equipped?",
      "175. Do you have CCTV security?",
      "176. Is the environment safe for students?",
      "177. Do you have separate seating arrangements?",
      "178. Are classrooms cleaned regularly?",
      "179. Do you have backup electricity?",
      "180. Is parking available?",
      "181. Do you have a waiting area for parents?",
      "182. Are washrooms clean and maintained?",
      "183. Do you have multimedia teaching tools?",
      "184. Are projectors used in classes?",
      "185. Do you provide drinking water?",
      "186. Is there a library?",
      "187. Do you offer study rooms?",
      "188. Are emergency measures in place?",
      "189. Is the institute noise-free?",
      "190. Do you provide comfortable seating?",
    ],
    answers: [
      "Yes. All classrooms are AC for comfort in summer.",
      "Yes. Modern lab with latest PCs, high-speed internet, and 1:1 computer for each student.",
      "Yes. Free high-speed Wi-Fi for all students during class hours.",
      "Yes. Whiteboards, projectors, sound system, and proper lighting in every room.",
      "Yes. 24/7 CCTV monitoring in all classrooms, labs, and corridors for safety.",
      "Yes. Separate female staff, security guard, CCTV, and strict entry system ensure safety.",
      "Yes. Option for separate male/female seating available on request.",
      "Yes. Daily cleaning + sanitization before each batch.",
      "Yes. UPS + generator ensure classes run during load shedding.",
      "Yes. Free bike and car parking space for students.",
      "Yes. Comfortable AC waiting lounge with seating and water for parents/guardians.",
      "Yes. Separate, clean washrooms for males/females, cleaned multiple times daily.",
      "Yes. Projectors, LEDs, speakers, and smart boards used for interactive learning.",
      "Yes. Most lectures, presentations, and videos are delivered via projector.",
      "Yes. Filtered water dispensers available on each floor.",
      "Yes. Small reference library with career, IT, and soft skills books students can use.",
      "Yes. Students can use empty classrooms for group study after class with permission.",
      "Yes. Fire extinguishers, first aid box, and emergency exits in the building.",
      "Yes. Soundproof classrooms away from main road to avoid disturbance.",
      "Yes. Cushioned chairs and proper desks for long classes.",
    ],
  },
  {
    id: 7,
    label: "7. Career & Results",
    icon: "🎯",
    headerBg: "bg-pink-600",
    viewAllColor: "text-pink-600",
    total: 10,
    ellipsisAfter: 4,
    questions: [
      "191. Do you help students choose careers?",
      "192. What are your student success stories?",
      "193. Do you offer job placement support?",
      "194. Do you provide internship opportunities?",
      "195. How do your courses improve employability?",
      "196. Do you guide students for freelancing?",
      "197. Are alumni connected with the institute?",
      "198. Do you provide recommendation letters?",
      "199. How do you measure student success?",
      "200. What opportunities can students expect after completing courses?",
    ],
    answers: [
      "Yes. Free career counseling session with aptitude test to guide you to the right field.",
      "Our students are now in banks, MNCs, IT companies, and own businesses. Check our social media for video testimonials.",
      "Yes. We share CVs with partner companies, conduct job fairs, and prep you for interviews. No fake job guarantee.",
      "Yes. Top students get internships at local companies through our network.",
      "We teach what companies actually want: communication, MS Office, confidence, and interview skills — not just theory.",
      "Yes. Special sessions on Fiverr, Upwork, and freelancing skills in IT + content writing courses.",
      "Yes. Active alumni WhatsApp group for networking, job sharing, and meetups.",
      "Yes. Top performers get signed recommendation letters for jobs/university applications.",
      "Through assessments, presentation marks, attendance, mock interviews, and final practical test.",
      "Better jobs, promotions, freelancing income, university admission success, and confidence to start business or speak publicly.",
    ],
  },
];

/* ─────────────────────────────────────────────
   CATEGORY CARD COMPONENT - ACCORDION STYLE
───────────────────────────────────────────── */
interface CatCardProps {
  cat: any;
  onViewAll: (c: any) => void;
}

function CatCard({ cat, onViewAll }: CatCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getFullQuestion = (idx: number) => {
    const q = cat.questions[idx];
    return q;
  };

  const toggleAnswer = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 overflow-hidden h-full">
      {/* Header */}
      <div className={`${cat.headerBg} flex items-center gap-1.5 px-2.5 py-1.5 text-white font-extrabold text-[10px] uppercase tracking-wide`}>
        <span className="text-[13px]">{cat.icon}</span>
        <span>{cat.label}</span>
      </div>

      {/* Body */}
      <div className="flex-1 bg-white px-2.5 py-1.5">
        {cat.questions.slice(0, cat.ellipsisAfter).map((_: string, i: number) => (
          <div key={i} className="border-b border-gray-100">
            <div
              className="text-blue-900 text-[10px] py-0.5 leading-snug flex items-center justify-between gap-1 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => toggleAnswer(i)}
            >
              <span className="flex-1">{getFullQuestion(i)}</span>
              <span className="text-gray-400 text-[8px]">
                {expandedIndex === i ? "▲" : "▼"}
              </span>
            </div>
            {expandedIndex === i && (
              <div className="text-gray-600 text-[9px] p-2 bg-gray-50 rounded mb-1 leading-relaxed">
                {cat.answers[i]}
              </div>
            )}
          </div>
        ))}
        {cat.questions.slice(cat.ellipsisAfter).map((_: string, i: number) => {
          const actualIndex = i + cat.ellipsisAfter;
          return (
            <div key={actualIndex} className="border-b border-gray-100">
              <div
                className="text-blue-900 text-[10px] py-0.5 leading-snug flex items-center justify-between gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => toggleAnswer(actualIndex)}
              >
                <span className="flex-1">{getFullQuestion(actualIndex)}</span>
                <span className="text-gray-400 text-[8px]">
                  {expandedIndex === actualIndex ? "▲" : "▼"}
                </span>
              </div>
              {expandedIndex === actualIndex && (
                <div className="text-gray-600 text-[9px] p-2 bg-gray-50 rounded mb-1 leading-relaxed">
                  {cat.answers[actualIndex]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <button
        onClick={() => onViewAll(cat)}
        className={`w-full flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 border-t border-gray-200 bg-white hover:bg-gray-50 transition-colors ${cat.viewAllColor}`}
      >
        View all {cat.total} questions <span>›</span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FULL QUESTIONS MODAL (View All)
───────────────────────────────────────────── */
function FullQuestionsModal({ cat, onClose }: { cat: any; onClose: () => void }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getFullQuestion = (idx: number) => {
    const q = cat.questions[idx];
    return q;
  };

  const toggleAnswer = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  if (!cat) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">{cat.icon}</span>
            <span className={`font-extrabold text-sm ${cat.viewAllColor}`}>{cat.label}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg font-bold leading-none">
            ✕
          </button>
        </div>

        {/* Questions List with Up/Down Arrows */}
        <div className="flex flex-col gap-2">
          {cat.questions.map((_: string, i: number) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                onClick={() => toggleAnswer(i)}
                className={`flex items-center justify-between px-3 py-2 text-[12px] font-semibold cursor-pointer transition-colors ${
                  expandedIndex === i
                    ? `${cat.headerBg} text-white`
                    : "bg-gray-50 text-blue-900 hover:bg-blue-50"
                }`}
              >
                <span className="pr-2">{getFullQuestion(i)}</span>
                <span className="ml-2 shrink-0 text-xs font-bold">
                  {expandedIndex === i ? "▲" : "▼"}
                </span>
              </div>
              {expandedIndex === i && (
                <div className="px-3 py-3 text-[12px] text-gray-700 leading-relaxed bg-white border-t border-gray-100">
                  {cat.answers[i]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────── */
export default function MeridiansChatbotPage() {
  const [fullModal, setFullModal] = useState<{ cat: any } | null>(null);

  const openFullModal = (cat: any) => setFullModal({ cat });
  const closeFullModal = () => setFullModal(null);

  const row1 = categories.slice(0, 3);
  const row2 = categories.slice(3, 6);
  const career = categories[6];

  return (
    <div className="font-sans">
      {/* Content */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-10 ">
          {/* Row 1 — 3 columns with gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-6">
            {row1.map((cat) => (
              <CatCard
                key={cat.id}
                cat={cat}
                onViewAll={(c) => openFullModal(c)}
              />
            ))}
          </div>

          {/* Row 2 — 3 columns with gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-6">
            {row2.map((cat) => (
              <CatCard
                key={cat.id}
                cat={cat}
                onViewAll={(c) => openFullModal(c)}
              />
            ))}
          </div>

          {/* Row 3 — Career card only (full width but same design) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-6">
            <CatCard
              cat={career}
              onViewAll={(c) => openFullModal(c)}
            />
          </div>
        </div>
      </div>

      {/* Full Questions Modal (only for View All button) */}
      {fullModal && (
        <FullQuestionsModal cat={fullModal.cat} onClose={closeFullModal} />
      )}
    </div>
  );
}