import React, { useId, useState } from "react";

const categoryItems = [
  "Mini Excavator's Blog",
  "Skid Steer's Blog",
  "Wheel loader's Blog",
  "Forklift's Blog",
  "Road Roller's Blog",
  "Scissor Lift's Blog",
  "Stone Crusher's Blog",
];

const latestBlogs = [
  {
    image: "/img/chatgpt-image-apr-28-2026-09-24-09-am-2-1.png",
    date: "12th June 2026",
    title: "On The Other Hand, We Denounce With And Dislike",
    imageClassName:
      "absolute top-0 left-0 w-[131px] h-[74px] aspect-[1.78] object-cover",
    dateClassName:
      "absolute top-[90px] left-[147px] w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-secondery text-xs tracking-[0] leading-[normal]",
    titleClassName:
      "absolute top-[30px] left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-secondery text-[15px] tracking-[0] leading-[normal]",
  },
  {
    image: "/img/chatgpt-image-apr-28-2026-09-26-28-am-2.png",
    date: "9th June 2026",
    title: "On The Other Hand, We Denounce With And Dislike",
    imageClassName:
      "absolute top-[89px] left-0 w-[130px] h-[73px] aspect-[1.78] object-cover",
    dateClassName:
      "absolute top-[179px] left-[147px] w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-secondery text-xs tracking-[0] leading-[normal]",
    titleClassName:
      "top-[119px] absolute left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-secondery text-[15px] tracking-[0] leading-[normal]",
  },
  {
    image: "/img/chatgpt-image-apr-28-2026-01-54-28-pm-2.png",
    date: "6th June 2026",
    title: "On The Other Hand, We Denounce With And Dislike",
    imageClassName:
      "absolute top-[177px] left-0 w-[131px] h-[74px] aspect-[1.78]",
    dateClassName:
      "absolute top-[267px] left-[147px] w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-secondery text-xs tracking-[0] leading-[normal]",
    titleClassName:
      "top-[207px] absolute left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-secondery text-[15px] tracking-[0] leading-[normal]",
  },
];

const comments = [
  {
    id: 1,
    avatar: "/img/image-74.png",
    name: "Mr. Sarak",
    message:
      "I really love this blog, please release more so i can enjoy my breakfast\nand lunch while reading this blog hahahahahahahahahaahahahha",
    top: "top-[6110px]",
    avatarTop: "top-[6120px]",
    nameTop: "top-[6110px]",
    messageTop: "top-[6150px]",
    replyButtonTop: "top-[6100px]",
    replyTextTop: "top-[6108px]",
  },
  {
    id: 2,
    avatar: "/img/image-74.png",
    name: "Mr. Sarak",
    message:
      "I really love this blog, please release more so i can enjoy my breakfast\nand lunch while reading this blog hahahahahahahahahaahahahha",
    top: "top-[6259px]",
    avatarTop: "top-[6269px]",
    nameTop: "top-[6259px]",
    messageTop: "top-[6299px]",
    replyButtonTop: "top-[6254px]",
    replyTextTop: "top-[6262px]",
  },
];

const articleContent = `Excavator Safety: Practical Tips for Safer Jobsite Work

Excavators are powerful machines, but they can create serious risk when the operator, crew, or jobsite is not prepared. Good excavator safety (https://machinery.org/operation-safety/) is not only about wearing a hard hat or reading a warning label. It is about checking the machine, planning the work area, watching people around the machine, and using the right method for the ground conditions.
For beginner operators, buyers, and business owners, safety should be part of the job from the first walkaround to the final shutdown. A safe excavator jobsite is usually cleaner, better planned, and more productive too.

Why Excavator Safety Starts Before Work Begins

A safe job does not start when the bucket touches the ground. It starts before the machine is turned on.
The operator should understand the work area, the digging plan, the ground condition, and the people working nearby. Before digging, the team should know where underground utilities may be located. Hitting a gas line, water line, sewer pipe, or electrical cable can stop the job and create a dangerous situation.
The operator should also look at the jobsite layout. Check for overhead power lines, soft ground, nearby buildings, road traffic, open trenches, workers on foot, and other machines moving in the same area.
For business owners, this planning step is important because many accidents happen when the crew is rushing or when no one clearly controls the work zone. A short safety meeting before digging can prevent confusion later.
A simple pre-work plan should answer these questions:
Who is allowed near the excavator?
Where will trucks, workers, and other machines move?
Where will the spoil pile go?
Is the ground strong enough to support the machine?
Are there underground or overhead hazards?
Does the operator understand the task clearly?
Small jobs still need planning. A mini excavator digging near a house, fence, driveway, or drainage line can still cause damage if the operator works without a clear plan.
 
Daily Walkaround Checks Operators Should Not Skip





















A walkaround inspection is one of the easiest safety habits, but it is often skipped when crews are busy. That is a mistake.
Before using the excavator, the operator should check the tracks or tires, hydraulic hoses, bucket pins, quick coupler, mirrors, lights, alarms, fluid leaks, and visible damage. If the machine has a cab, the glass should be clean enough to see clearly. If it has a backup alarm or camera system, make sure it works before moving the machine.
Hydraulic leaks need attention. A small leak can become a bigger failure under pressure. Loose pins, damaged teeth, cracked hoses, and worn bucket parts can also create safety problems during digging or lifting.
The operator should also check the controls before starting full work. Move the boom, arm, bucket, and swing slowly in a safe open area. Listen for unusual noise and feel for strange movement. If something feels wrong, stop and inspect it before continuing.
For owners buying used excavators, safety checks are also part of machine value. A cheap excavator (https://machinery.org/product/https-machinery-org-store-typhon-tyrant-x-1-ton-mini-excavator-with-13-5hp-briggs-stratton-engine-hydraulic-oil-cooler-thumb-clip-p-8175886/ )with poor brakes, weak hydraulics, damaged guards, or a loose attachment system can cost more in downtime and risk.

Safe Digging Around Trenches, Utilities, and Workers

Digging work needs extra care because the ground can change quickly. A trench wall may look stable, but soil can collapse without much warning. OSHA describes cave-ins as one of the main hazards in trenching and excavation work, and protective systems such as sloping, shoring, benching, or shielding may be needed depending on depth and soil condition.
Never assume a trench is safe because it is only for a quick task. Workers should not enter an unsafe trench. NIOSH warns that trench walls can collapse suddenly, and even a small amount of soil can weigh enough to crush or suffocate a worker.
The excavator operator should keep spoil piles, materials, and equipment away from the trench edge. Extra weight near the edge can make the wall weaker and increase the risk of collapse. OSHA also advises keeping materials away from trench edges and making sure there is safe entry and exit for workers.
The operator should never swing a loaded bucket over workers. Workers should also stay out of the swing area unless the machine is stopped and the operator knows they are there.
When digging near utilities, use safe locating practices before excavation starts. Do not rely only on guesswork, old site drawings, or what someone remembers from a previous job. Utility strikes can be expensive and dangerous.
Good digging safety comes down to control. Dig in steady movements, avoid sudden swings, and keep the machine stable. If the trench becomes deeper, wetter, or less stable than expected, stop and reassess the job.

Managing Blind Spots and People on the Jobsite

Excavators have blind spots. Even skilled operators cannot see every area around the machine at all times. The counterweight, boom, cab frame, bucket, and jobsite materials can block the operator's view.
NIOSH notes that limited visibility around construction equipment can contribute to struck-by injuries on jobsites. OSHA also lists struck-by hazards as a major construction safety concern, especially around vehicles and heavy equipment.
This is why ground workers should not walk behind, beside, or inside the swing radius of an operating excavator. If someone needs to approach the machine, they should make eye contact with the operator and wait until the machine stops.
On busy jobsites, use a spotter when needed. A spotter can help guide the operator in tight areas, near traffic, around buildings, or when loading trucks. But the spotter also needs a safe position. Standing too close to the bucket, tracks, trench edge, or counterweight is not safe.
Clear communication matters. Hand signals, radios, or agreed jobsite signals can reduce confusion. The key is to make sure everyone understands the same signals before the work starts.
For small contractors and property owners, this rule is simple: keep people away from the machine while it is working. Family members, helpers, customers, and bystanders should not stand near the digging area just to watch.

Working Safely on Slopes, Soft Ground, and Tight Areas





















Excavators can work in rough conditions(https://machinery.org/mini-excavator-features/ ), but they are not impossible to tip. Slopes, wet soil, loose gravel, soft ground, and uneven surfaces can affect machine stability.
Before working on a slope, the operator should understand the machine's limits. Keep the machine balanced, avoid sudden turns, and do not swing heavy loads downhill if it can be avoided. Travel slowly and keep attachments low when moving.
Soft ground is another common problem. A machine may feel stable at first, then sink as digging continues. This can happen near ponds, drainage areas, fresh fill, muddy jobsites, or trench edges. If the ground starts giving way, stop before the machine gets stuck or unstable.
Tight areas bring different risks. A compact excavator may fit through narrow spaces, but the operator still needs room to swing, dig, and move safely. Watch for walls, fences, parked vehicles, glass, overhead structures, and people walking nearby.
When working close to a building, check the digging distance carefully. Digging too close to a foundation, sidewalk, or retaining wall can weaken the ground around it.
A safe operator does not rush in tight spaces. Slow movement is better than damage, injury, or a machine stuck in a bad position
.
Attachment Safety and Load Control 
 
Attachments make excavators more useful, but they also change how the machine handles. Buckets, hydraulic breakers, augers, thumbs, grapples, rippers, and compactors all create different safety concerns.
Before using any attachment, check that it matches the excavator size, hydraulic flow, pressure, and coupler system. An attachment that is too heavy or not fitted correctly can affect balance and control.
The operator should inspect the attachment connection before work. Make sure pins, locks, hoses, and couplers are secure. A loose bucket or attachment can fall, swing unexpectedly, or damage the machine.
When lifting materials, know the machine's lifting limits. Do not guess. The machine may feel strong, but lifting too much can reduce stability, especially with the boom extended or the machine sitting on uneven ground.
Keep loads low and controlled. Avoid swinging fast with a heavy load. Do not lift people with a bucket or attachment. Excavators are not designed for that kind of use unless a proper approved system is used for the specific job and regulation.
Hydraulic attachments also need care. A breaker, auger, or compactor can put stress on the machine and the ground around it. Keep workers clear, use the right operating angle, and stop if hoses leak, fittings loosen, or the attachment moves strangely.

Final Excavator Safety Habits That Matter Every Day

Good excavator safety is built from small habits repeated every day.
Use the seat belt. Keep the cab clean. Do not operate while distracted. Do not let untrained people use the machine. Keep hands and feet away from pinch points. Lower the attachment before shutting down. Park on stable ground. Lock the machine when it is not in use.
Operators should also know when to stop. If the trench looks unsafe, stop. If the machine feels unstable, stop. If workers enter the swing area, stop. If the attachment does not lock correctly, stop.
Stopping the machine for a few minutes is better than forcing the job and creating a serious problem.
For owners and business managers, safety should be part of training, not just a rule on paper. New operators need time to learn machine control, jobsite awareness, inspection habits, and safe digging practices. A good machine still needs a careful operator.
Excavators are useful because they are powerful, flexible, and productive. That same power is why safety matters. When the machine is inspected, the work area is controlled, and the crew communicates clearly, the job becomes safer for everyone.

Conclusion

Excavator safety is not complicated, but it does require attention. Plan the job, inspect the machine, keep people out of danger zones, respect trench hazards, and use attachments correctly. These simple habits can prevent damage, downtime, and serious injuries.
A safe excavator operator does not just move dirt. They protect the machine, the crew, and the jobsite.`;

export const SingleBlog = (): JSX.Element => {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main
      className="overflow-hidden w-full min-w-[1920px] min-h-[8827px] relative bg-[#282828]"
      data-model-id="1645:4120"
    >
      <div className="absolute top-0 left-0 w-[1920px] h-[9353px] bg-[#282828]" />
      <section
        className="absolute top-[120px] left-0 w-[1920px] h-[720px] bg-[#d9d9d9] bg-[url(/img/new-project-24-1.png)] bg-cover bg-[50%_50%]"
        aria-label="Blog hero"
      >
        <div className="absolute top-[254px] left-[1182px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Malking-Regular',Helvetica] font-normal text-[#d8c79a] text-[90px] tracking-[0] leading-[normal] whitespace-nowrap">
          BLOG DETIALS
        </div>
        <h1 className="absolute top-[360px] left-[1182px] w-[613px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[45px] tracking-[0] leading-[normal]">
          Excavator Safety: Practical Tips for Safer Jobsite Work
        </h1>
        <div className="absolute top-[204px] left-[1456px] [font-family:'Google_Sans_Flex',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
          Home
        </div>
        <img
          className="absolute top-[196px] left-[1411px] w-[38px] h-[38px]"
          alt="Home"
          src="/img/home.svg"
        />
      </section>
      <article aria-label="Single blog article">
        <img
          className="absolute top-[889px] left-[90px] w-[1289px] h-[725px] aspect-[1.78] object-cover"
          alt="Excavator blog featured visual"
          src="/img/chatgpt-image-apr-28-2026-09-24-09-am-2.png"
        />
        <div className="absolute top-[1649px] left-[90px] w-[243px] h-14 bg-[#153d28]" />
        <div className="absolute top-[1664px] left-[103px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
          Mini Excavator&apos;s Blog
        </div>
        <img
          className="top-[1649px] left-[371px] w-14 h-14 absolute aspect-[1]"
          alt="Author avatar"
          src="/img/286f1e83ef7372ad17b09ff60c8264c5-2.png"
        />
        <div className="absolute top-[1665px] left-[435px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal] whitespace-nowrap">
          Denvor Wayne
        </div>
        <div className="absolute top-[1665px] left-[639px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal] whitespace-nowrap">
          2 Comments
        </div>
        <div className="absolute top-[1665px] left-[827px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-[21px] tracking-[0] leading-[normal] whitespace-nowrap">
          12th June 2026
        </div>
        <img
          className="absolute top-[1665px] left-[607px] w-6 h-6"
          alt="Comment"
          src="/img/comment.svg"
        />
        <img
          className="absolute top-[1664px] left-[795px] w-6 h-6"
          alt="Date range"
          src="/img/date-range.svg"
        />
        <div className='absolute top-[1740px] left-[90px] w-[1289px] [font-family:"undefined-Regular",Helvetica] text-white text-[0.1px] leading-[normal] whitespace-pre-wrap'>
          {articleContent}
        </div>
        <img
          className="absolute top-[2442px] left-[90px] w-[1292px] h-[727px] aspect-[1.78] object-cover"
          alt="Excavator safety worksite image"
          src="/img/chatgpt-image-apr-28-2026-02-48-35-pm-1.png"
        />
        <img
          className="top-[4194px] left-[90px] w-[1292px] h-[727px] absolute aspect-[1.78] object-cover"
          alt="Excavator engine and field image"
          src="/img/chatgpt-image-apr-28-2026-09-26-28-am-3.png"
        />
      </article>
      <aside
        className="absolute top-[889px] left-[1469px] w-[377px] h-[361px]"
        aria-label="Blog categories"
      >
        <div className="absolute top-0 left-0 w-[361px] h-[361px] bg-[#d9d9d9]" />
        <div className="absolute top-[55px] left-1.5 w-[346px] h-[3px] bg-[#153d28]" />
        <h2 className="absolute top-[15px] left-1.5 [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">
          Blog&apos;s Categories
        </h2>
        <img
          className="absolute top-[9px] left-[321px] w-10 h-10"
          alt="Arrow drop left"
          src="/img/arrow-drop-left-1.svg"
        />
        {categoryItems.map((item, index) => {
          const top = 73 + index * 39;
          const boxTop = 71 + index * 39;

          return (
            <React.Fragment key={item}>
              <div
                className="absolute left-[42px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal] whitespace-nowrap"
                style={{ top }}
              >
                {item}
              </div>
              <div
                className="absolute left-1.5 w-[27px] h-[27px] border-[3px] border-solid border-[#153d28]"
                style={{ top: boxTop }}
              />
            </React.Fragment>
          );
        })}
      </aside>
      <aside
        className="absolute top-[1284px] left-[1469px] w-[367px] h-[361px]"
        aria-label="Latest blogs"
      >
        <div className="absolute top-0 left-0 w-[363px] h-[361px]">
          <div className="absolute top-0 left-0 w-[361px] h-[361px] bg-[#d9d9d9]" />
          <div className="absolute top-[55px] left-1.5 w-[346px] h-[3px] bg-[#153d28]" />
          <h2 className="absolute top-[15px] left-1.5 [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">
            Latest Blogs
          </h2>
          <img
            className="absolute top-[9px] left-[321px] w-10 h-10"
            alt="Arrow drop left"
            src="/img/arrow-drop-left-1.svg"
          />
        </div>
        <div className="absolute top-[81px] left-1.5 w-[341px] h-[251px]">
          {latestBlogs.map((blog) => (
            <React.Fragment key={`${blog.date}-${blog.title}`}>
              <img
                className={blog.imageClassName}
                alt={blog.title}
                src={blog.image}
              />
              <div className={blog.dateClassName}>{blog.date}</div>
              <p className={blog.titleClassName}>{blog.title}</p>
            </React.Fragment>
          ))}
        </div>
      </aside>
      <div className="absolute top-[1686px] left-[1535px] [font-family:'Clofie-Bold',Helvetica] font-bold text-[#d8c79a] text-3xl tracking-[0] leading-[normal] whitespace-nowrap">
        Social Medias
      </div>
      <img
        className="absolute w-[260px] h-[45px] top-[1712px] left-[1502px]"
        alt="Social media icons"
        src="/img/icon.png"
      />
      <section
        className="absolute top-[5999px] left-[90px] w-[1289px] h-[589px] bg-[#d9d9d9]"
        aria-label="Comments"
      />
      <section aria-label="2 Comments">
        <h2 className="absolute top-[6033px] left-[132px] [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">
          2 Comments
        </h2>
        {comments.map((comment) => (
          <div key={comment.id}>
            <img
              className={`absolute left-[214px] w-[66px] h-[66px] aspect-[1] ${comment.avatarTop}`}
              alt={`${comment.name} avatar`}
              src={comment.avatar}
            />
            <div
              className={`absolute left-[307px] [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap ${comment.nameTop}`}
            >
              {comment.name}
            </div>
            <p
              className={`absolute left-[307px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-black text-[21px] tracking-[0] leading-[normal] whitespace-pre-line ${comment.messageTop}`}
            >
              {comment.message}
            </p>
            <button
              type="button"
              className={`absolute left-[1103px] w-28 h-10 bg-[#153d28] shadow-[0px_4px_4px_#00000040] ${comment.replyButtonTop}`}
              aria-label={`Reply to ${comment.name}`}
            />
            <div
              className={`absolute left-[1134px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-white text-lg tracking-[0] leading-[normal] ${comment.replyTextTop}`}
            >
              Reply
            </div>
          </div>
        ))}

        <img
          className="top-[6411px] left-[390px] w-[66px] h-[66px] absolute aspect-[1]"
          alt="Reply author avatar"
          src="/img/286f1e83ef7372ad17b09ff60c8264c5-3.png"
        />
        <img
          className="absolute top-[6411px] left-[311px] w-[60px] h-[60px]"
          alt="Back"
          src="/img/back.svg"
        />
        <p className="absolute top-[6400px] left-[475px] [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">
          Denvor Wayne - Arthur Morgan
        </p>
        <p className="absolute top-[6442px] left-[475px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-black text-[21px] tracking-[0] leading-[normal]">
          Thank you very much my friend i will keep on posting blog like this!
          <br />
          Hope you have fun at work
        </p>
      </section>
      <section
        className="absolute top-[6637px] left-[90px] w-[1289px] h-[800px] bg-[#d9d9d9]"
        aria-label="Leave a comment"
      >
        <h2 className="absolute top-[36px] left-[57px] [font-family:'Clofie-Bold',Helvetica] font-bold text-black text-[27px] tracking-[0] leading-[normal] whitespace-nowrap">
          Leave a Comment
        </h2>
        <form
          onSubmit={handleSubmit}
          className="absolute top-[100px] left-[57px] w-[1181px] h-[555px]"
        >
          <div className="absolute top-0 left-0 w-[478px] h-[104px] bg-[#bfbfbf]" />
          <div className="absolute top-0 left-[503px] w-[672px] h-[104px] bg-[#bfbfbf]" />
          <div className="absolute top-[122px] left-0 w-[1175px] h-[344px] bg-[#bfbfbf]" />
          <label
            htmlFor={nameId}
            className="top-[38px] left-9 absolute [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#818181] text-[21px] tracking-[0] leading-[normal]"
          >
            Your Name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            aria-label="Your Name"
            className="absolute top-0 left-0 w-[478px] h-[104px] px-9 pt-[62px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#444444] text-[21px] tracking-[0] leading-[normal]"
          />
          <label
            htmlFor={emailId}
            className="top-[38px] left-[539px] absolute [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#818181] text-[21px] tracking-[0] leading-[normal]"
          >
            Your Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            aria-label="Your Email"
            className="absolute top-0 left-[503px] w-[672px] h-[104px] px-9 pt-[62px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#444444] text-[21px] tracking-[0] leading-[normal]"
          />
          <label
            htmlFor={messageId}
            className="top-[158px] left-9 absolute [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#818181] text-[21px] tracking-[0] leading-[normal]"
          >
            Your Message
          </label>
          <textarea
            id={messageId}
            name="message"
            value={formData.message}
            onChange={handleChange}
            aria-label="Your Message"
            className="absolute top-[122px] left-0 w-[1175px] h-[344px] resize-none px-9 pt-[62px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#444444] text-[21px] tracking-[0] leading-[normal]"
          />
          <button
            type="submit"
            className="absolute top-[484px] left-0 w-[362px] h-[71px]"
            aria-label="Submit comment"
          >
            <div className="w-[364px] h-[71px] relative">
              <div className="absolute top-0 left-0 w-[362px] h-[71px] bg-[#153d28]" />
              <div className="absolute top-[21px] left-[46px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-white text-2xl tracking-[0] leading-[normal]">
                SUBMIT COMMENT
              </div>
              <img
                className="absolute top-[13px] left-[280px] w-[46px] h-[46px]"
                alt="Transfer long right"
                src="/img/transfer-long-right.svg"
              />
            </div>
          </button>
        </form>
      </section>
      <section
        className="absolute top-[7590px] -left-px w-[1920px] h-[375px] overflow-hidden"
        aria-label="Call to action"
      >
        <div className="absolute top-[-82px] left-0 w-[1920px] h-[540px] bg-[#153d28]" />
        <div className="absolute w-[2275px] h-[580px] top-[-62px] -left-32">
          <div className="absolute top-px left-px w-[2275px] h-[580px]">
            <img
              className="absolute top-[62px] left-[1756px] w-[292px] h-[375px]"
              alt="House"
              src="/img/house.svg"
            />
            <img
              className="absolute top-[62px] left-[129px] w-[201px] h-[350px]"
              alt="House"
              src="/img/house-1.svg"
            />
            <div className="absolute top-[180px] left-[166px] w-[318px] h-[318px] bg-[#153d28] rounded-[159px] blur-[75px]" />
            <div className="absolute top-[186px] left-[1616px] w-[394px] h-[394px] bg-[#153d28] rounded-[159px] blur-[75px]" />
          </div>
          <div className="absolute top-[201px] left-[551px] w-[705px] h-[98px] flex gap-[46px]">
            <img
              className="w-[98.01px] h-[98.01px]"
              alt="Call"
              src="/img/call.png"
            />
            <p className="mt-[1.0px] w-[559px] h-24 [font-family:'Readex_Pro',Helvetica] font-semibold text-transparent text-4xl tracking-[0] leading-[48px]">
              <span className="text-white">
                Make An Appointment This Call Now{" "}
              </span>
              <a
                href="tel:+12132142203"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-[#d8c79a] underline">
                  +1 213-214-2203
                </span>
              </a>
            </p>
          </div>
        </div>
        <a
          href="tel:+12132142203"
          rel="noopener noreferrer"
          target="_blank"
          className="absolute top-[150px] left-[1226px] w-[271px] h-[75px] flex border-4 border-solid border-[#d8c79a]"
          aria-label="Call us now at +1 213-214-2203"
        >
          <div className="mt-[23px] w-[180px] ml-[50px] flex gap-[5px]">
            <div className="mt-0.5 w-[143px] h-[26px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#d8c79a] text-[21px] tracking-[0] leading-[normal]">
              CALL US NOW
            </div>
            <div className="w-[30px] h-7 flex">
              <img
                className="flex-1 w-[9.65px]"
                alt="Vector"
                src="/img/vector-9.svg"
              />
            </div>
          </div>
        </a>
      </section>
    </main>
  );
};
