import React, { useId, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimaScaler } from "../../components/layout/AnimaScaler";
import {
  type BlogPost,
  blogCategories,
  blogPosts,
  getBlogPostBySlug,
  getBlogPostHref,
  latestBlogPosts,
} from "../../data/blogPosts";
import { useI18n } from "../../context/I18nContext";
import { blogCategoryKey } from "../../i18n/keys";

const latestBlogLayouts = [
  {
    imageClassName:
      "absolute top-0 left-0 w-[131px] h-[74px] aspect-[1.78] object-cover",
    dateClassName:
      "absolute top-[90px] left-[147px] w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-secondery text-xs tracking-[0] leading-[normal]",
    titleClassName:
      "absolute top-[30px] left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-secondery text-[15px] tracking-[0] leading-[normal]",
  },
  {
    imageClassName:
      "absolute top-[89px] left-0 w-[130px] h-[73px] aspect-[1.78] object-cover",
    dateClassName:
      "absolute top-[179px] left-[147px] w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-secondery text-xs tracking-[0] leading-[normal]",
    titleClassName:
      "top-[119px] absolute left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-secondery text-[15px] tracking-[0] leading-[normal]",
  },
  {
    imageClassName:
      "absolute top-[177px] left-0 w-[131px] h-[74px] aspect-[1.78]",
    dateClassName:
      "absolute top-[267px] left-[147px] w-[77px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-secondery text-xs tracking-[0] leading-[normal]",
    titleClassName:
      "top-[207px] absolute left-[141px] w-[194px] [font-family:'Clofie-Bold',Helvetica] font-bold text-secondery text-[15px] tracking-[0] leading-[normal]",
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
For owners buying used excavators, safety checks are also part of machine value. A cheap excavator with poor brakes, weak hydraulics, damaged guards, or a loose attachment system can cost more in downtime and risk.

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

type CommentFormData = {
  name: string;
  email: string;
  message: string;
};

const SingleBlogMobile: React.FC<{
  post: BlogPost;
  latestPosts: BlogPost[];
  articleText: string;
  firstContentImage: string;
  secondContentImage: string;
  formData: CommentFormData;
  nameId: string;
  emailId: string;
  messageId: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  comments: any[];
}> = ({
  post,
  latestPosts,
  articleText,
  firstContentImage,
  secondContentImage,
  formData,
  nameId,
  emailId,
  messageId,
  onChange,
  onSubmit,
  comments,
}) => {
  const { t } = useI18n();


  return (
  <main className="bg-theme-bg text-theme-text pt-[72px] min-h-screen transition-colors duration-200">
    <section className="relative min-h-[420px] overflow-hidden bg-theme-bg bg-[url(/single-blog/img/new-project-24-1.png)] bg-cover bg-[24%_center] transition-colors duration-200">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-theme-bg/20 to-theme-bg/95 transition-colors" />
      <div className="relative min-h-[420px] px-5 py-10 flex flex-col items-start justify-end text-left">
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-2 [font-family:'Google_Sans_Flex',Helvetica] text-theme-text text-base transition-colors"
        >
          <img className="w-5 h-5 dark:invert-0 invert" alt="" src="/single-blog/img/home.svg" />
          {t("nav.home")}
        </Link>
        <p className="[font-family:'Malking-Regular',Helvetica] text-theme-heading text-[32px] leading-none drop-shadow-[0_3px_4px_rgba(0,0,0,0.15)] transition-colors">
          {t("blog.detailsTitle")}
        </p>
        <h1 className="mt-3 max-w-[330px] [font-family:'Glonimove-Regular',Helvetica] text-theme-text text-[21px] leading-snug drop-shadow-[0_3px_4px_rgba(0,0,0,0.1)] transition-colors">
          {post.title}
        </h1>
      </div>
    </section>

    <article className="px-5 py-8">
      <img
        className="w-full aspect-[16/9] object-cover border border-theme-border/10"
        alt={post.title}
        src={post.detailImage}
      />

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 [font-family:'Glonimove-Regular',Helvetica] text-[12px] text-theme-text/85 transition-colors">
        <span className="bg-brand-green px-3 py-2 text-white">
          {t(blogCategoryKey(post.category), { fallback: post.category })}
        </span>
        <span className="inline-flex items-center gap-2">
          <img
            className="w-6 h-6"
            alt=""
            src="/single-blog/img/286f1e83ef7372ad17b09ff60c8264c5-2.png"
          />
          {post.author}
        </span>
        <span className="inline-flex items-center gap-1">
          <img className="w-4 h-4 dark:invert-0 invert" alt="" src="/single-blog/img/comment.svg" />
          {t("blog.comments", { values: { count: post.commentCount } })}
        </span>
        <span className="inline-flex items-center gap-1">
          <img className="w-4 h-4 dark:invert-0 invert" alt="" src="/single-blog/img/date-range.svg" />
          {post.date}
        </span>
      </div>

      <div className="mt-6 [font-family:'Glonimove-Regular',Helvetica] text-[15px] leading-7 text-theme-text/90 whitespace-pre-line transition-colors">
        {articleText}
      </div>

      <div className="mt-8 space-y-5">
        <img
          className="w-full aspect-[16/9] object-cover border border-theme-border/10"
          alt={t("blog.worksiteImage", { values: { title: post.title } })}
          src={firstContentImage}
        />
        <img
          className="w-full aspect-[16/9] object-cover border border-theme-border/10"
          alt={t("blog.fieldImage", { values: { title: post.title } })}
          src={secondContentImage}
        />
      </div>
    </article>

    <aside className="px-5 pb-8 space-y-6">
      <section className="bg-theme-card border border-theme-border/10 text-theme-text p-5 transition-colors duration-200">
        <h2 className="[font-family:'Clofie-Bold',Helvetica] text-[23px] border-b-[3px] border-theme-accent pb-3 text-theme-heading transition-colors">
          {t("blog.categories")}
        </h2>
        <ul className="mt-4 space-y-3">
          {blogCategories.map((category) => (
            <li key={category} className="flex items-center gap-3">
              <span className="w-5 h-5 border-[3px] border-theme-accent transition-colors" aria-hidden="true" />
              <span className="[font-family:'Glonimove-Regular',Helvetica] text-[15px]">
                {t(blogCategoryKey(category), { fallback: category })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-theme-card border border-theme-border/10 text-theme-text p-5 transition-colors duration-200">
        <h2 className="[font-family:'Clofie-Bold',Helvetica] text-[23px] border-b-[3px] border-theme-accent pb-3 text-theme-heading transition-colors">
          {t("blog.latest")}
        </h2>
        <div className="mt-4 space-y-4">
          {latestPosts.map((blog) => (
            <article key={blog.slug} className="grid grid-cols-[112px_1fr] gap-3">
              <Link to={getBlogPostHref(blog)} className="block bg-theme-sec border border-theme-border/10">
                <img
                  className="w-full aspect-[16/9] object-cover"
                  alt={blog.title}
                  src={blog.image}
                />
              </Link>
              <div>
                <p className="[font-family:'Glonimove-Regular',Helvetica] text-xs text-theme-muted transition-colors">
                  {blog.date}
                </p>
                <Link
                  to={getBlogPostHref(blog)}
                  className="mt-1 block [font-family:'Clofie-Bold',Helvetica] text-[14px] leading-snug hover:text-theme-accent text-theme-text transition-colors"
                >
                  {blog.title}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </aside>

    <section className="px-5 pb-8">
      <div className="bg-theme-card border border-theme-border/10 text-theme-text p-5 transition-colors duration-200">
        <h2 className="[font-family:'Clofie-Bold',Helvetica] text-[23px] text-theme-heading transition-colors">{t("blog.comments", { values: { count: 2 } })}</h2>
        <div className="mt-5 space-y-6">
          {comments.map((comment) => (
            <article key={comment.id} className="grid grid-cols-[52px_1fr] gap-4">
              <img
                className="w-[52px] h-[52px] object-cover border border-theme-border/10 rounded-full"
                alt={t("blog.authorAvatar")}
                src={comment.avatar}
              />
              <div>
                <h3 className="[font-family:'Clofie-Bold',Helvetica] text-[19px] text-theme-text transition-colors">
                  {comment.name}
                </h3>
                <p className="mt-2 [font-family:'Glonimove-Regular',Helvetica] text-[14px] leading-6 whitespace-pre-line text-theme-text/80 transition-colors">
                  {comment.message}
                </p>
                <button
                  type="button"
                  className="mt-3 bg-brand-green hover:bg-brand-greenDark text-white px-5 py-2 [font-family:'Google_Sans_Flex',Helvetica] text-sm font-bold transition-colors duration-200"
                >
                  {t("blog.reply")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="px-5 pb-10">
      <div className="bg-theme-card border border-theme-border/10 text-theme-text p-5 transition-colors duration-200">
        <h2 className="[font-family:'Clofie-Bold',Helvetica] text-[23px] text-theme-heading transition-colors">{t("blog.leaveComment")}</h2>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor={nameId}
              className="block [font-family:'Google_Sans_Flex',Helvetica] font-bold text-theme-muted text-sm transition-colors"
            >
              {t("blog.yourName")}
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              value={formData.name}
              onChange={onChange}
              autoComplete="name"
              className="mt-2 w-full bg-theme-sec border border-theme-border/20 px-4 py-4 [font-family:'Google_Sans_Flex',Helvetica] text-theme-text outline-none transition-colors duration-200"
            />
          </div>
          <div>
            <label
              htmlFor={emailId}
              className="block [font-family:'Google_Sans_Flex',Helvetica] font-bold text-theme-muted text-sm transition-colors"
            >
              {t("blog.yourEmail")}
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              autoComplete="email"
              className="mt-2 w-full bg-theme-sec border border-theme-border/20 px-4 py-4 [font-family:'Google_Sans_Flex',Helvetica] text-theme-text outline-none transition-colors duration-200"
            />
          </div>
          <div>
            <label
              htmlFor={messageId}
              className="block [font-family:'Google_Sans_Flex',Helvetica] font-bold text-theme-muted text-sm transition-colors"
            >
              {t("blog.yourMessage")}
            </label>
            <textarea
              id={messageId}
              name="message"
              value={formData.message}
              onChange={onChange}
              className="mt-2 min-h-[160px] w-full resize-none bg-theme-sec border border-theme-border/20 px-4 py-4 [font-family:'Google_Sans_Flex',Helvetica] text-theme-text outline-none transition-colors duration-200"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-greenDark text-white px-6 py-4 [font-family:'Google_Sans_Flex',Helvetica] font-bold transition-colors duration-200"
          >
            {t("blog.submitComment")}
          </button>
        </form>
      </div>
    </section>

    <section className="bg-[#153d28] px-5 py-8 text-center text-white">
      <p className="[font-family:'Readex_Pro',Helvetica] text-[22px] leading-8 font-semibold">
        {t("blog.appointmentText")}{" "}
        <a href="tel:+12132142203" className="text-[#d8c79a] underline">
          +1 213-214-2203
        </a>
      </p>
      <a
        href="tel:+12132142203"
        className="mt-5 inline-flex border-4 border-[#d8c79a] px-6 py-3 [font-family:'Google_Sans_Flex',Helvetica] text-[#d8c79a] font-bold hover:bg-[#d8c79a] hover:text-[#153d28] transition-colors duration-200"
      >
        {t("action.callUsNow")}
      </a>
    </section>
  </main>
  );
};

export const SingleBlog = (): JSX.Element => {
  const { t } = useI18n();
  const { blogSlug } = useParams<{ blogSlug: string }>();
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

  const post = getBlogPostBySlug(blogSlug) ?? blogPosts[0];
  const visibleLatestBlogs = latestBlogPosts
    .filter((latestPost) => latestPost.slug !== post.slug)
    .slice(0, 3);
  const firstContentImage = post.contentImages[0] ?? post.detailImage;
  const secondContentImage = post.contentImages[1] ?? post.detailImage;
  const articleText = post.content || articleContent;

  const comments = [
    {
      id: 1,
      avatar: "/single-blog/img/image-74.png",
      name: t("auto.singleblog.mr.sarak"),
      message: t("auto.singleblog.i.really.love"),
      top: "top-[6110px]",
      avatarTop: "top-[6120px]",
      nameTop: "top-[6110px]",
      messageTop: "top-[6150px]",
      replyButtonTop: "top-[6100px]",
      replyTextTop: "top-[6108px]",
    },
    {
      id: 2,
      avatar: "/single-blog/img/image-74.png",
      name: t("auto.singleblog.mr.sarak"),
      message: t("auto.singleblog.i.really.love"),
      top: "top-[6259px]",
      avatarTop: "top-[6269px]",
      nameTop: "top-[6259px]",
      messageTop: "top-[6299px]",
      replyButtonTop: "top-[6254px]",
      replyTextTop: "top-[6262px]",
    },
  ];

  return (
    <AnimaScaler
      bgColor="var(--theme-bg)"
      mobile={
        <SingleBlogMobile
          post={post}
          latestPosts={visibleLatestBlogs}
          articleText={articleText}
          firstContentImage={firstContentImage}
          secondContentImage={secondContentImage}
          formData={formData}
          nameId={nameId}
          emailId={emailId}
          messageId={messageId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          comments={comments}
        />
      }
    >
    <main
      className="overflow-hidden w-full min-w-[1920px] min-h-[8827px] relative bg-theme-bg text-theme-text transition-colors duration-200"
      data-model-id="1645:4120"
    >
      <div className="absolute top-0 left-0 w-[1920px] h-[9353px] bg-theme-bg transition-colors duration-200" />
      <section
        className="absolute top-[120px] left-0 w-[1920px] h-[720px] bg-theme-sec bg-[url(/single-blog/img/new-project-24-1.png)] bg-cover bg-[50%_50%] transition-colors duration-200"
        aria-label={t("blog.detailsTitle")}
      >
        <div className="absolute top-[254px] left-[1182px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Malking-Regular',Helvetica] font-normal text-theme-heading text-[90px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors">
          {t("blog.detailsTitle")}
        </div>
        <h1 className="absolute top-[360px] left-[1182px] w-[613px] [text-shadow:0px_4px_4px_#00000040] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-text text-[45px] tracking-[0] leading-[normal] transition-colors">
          {post.title}
        </h1>
        <Link
          to="/"
          className="absolute top-[204px] left-[1456px] [font-family:'Google_Sans_Flex',Helvetica] font-normal text-theme-text hover:text-theme-accent text-2xl tracking-[0] leading-[normal] transition-colors"
        >
          {t("nav.home")}
        </Link>
        <img
          className="absolute top-[196px] left-[1411px] w-[38px] h-[38px] dark:invert-0 invert"
          alt={t("blog.homeIcon")}
          src="/single-blog/img/home.svg"
        />
      </section>
      <article aria-label={t("blog.detailsTitle")}>
        <img
          className="absolute top-[889px] left-[90px] w-[1289px] h-[725px] aspect-[1.78] object-cover border border-theme-border/10"
          alt={post.title}
          src={post.detailImage}
        />
        <div className="absolute top-[1649px] left-[90px] h-14 min-w-[243px] bg-brand-green px-[13px] flex items-center [font-family:'Glonimove-Regular',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
          {t(blogCategoryKey(post.category), { fallback: post.category })}
        </div>
        <img
          className="top-[1649px] left-[371px] w-14 h-14 absolute aspect-[1] rounded-full"
          alt={t("blog.authorAvatar")}
          src="/single-blog/img/286f1e83ef7372ad17b09ff60c8264c5-2.png"
        />
        <div className="absolute top-[1665px] left-[435px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-text text-[21px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors">
          {post.author}
        </div>
        <div className="absolute top-[1665px] left-[639px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-text text-[21px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors">
          {t("blog.comments", { values: { count: post.commentCount } })}
        </div>
        <div className="absolute top-[1665px] left-[827px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-text text-[21px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors">
          {post.date}
        </div>
        <img
          className="absolute top-[1665px] left-[607px] w-6 h-6 dark:invert-0 invert"
          alt="Comment"
          src="/single-blog/img/comment.svg"
        />
        <img
          className="absolute top-[1664px] left-[795px] w-6 h-6 dark:invert-0 invert"
          alt={t("auto.singleblog.date.range")}
          src="/single-blog/img/date-range.svg"
        />
        <div className="absolute top-[1740px] left-[90px] w-[1289px] [font-family:'Glonimove-Regular',Helvetica] text-theme-text text-[21px] leading-[32px] tracking-[0] whitespace-pre-wrap transition-colors">
          {articleText}
        </div>
        <img
          className="absolute top-[2442px] left-[90px] w-[1292px] h-[727px] aspect-[1.78] object-cover border border-theme-border/10"
          alt={t("blog.worksiteImage", { values: { title: post.title } })}
          src={firstContentImage}
        />
        <img
          className="top-[4194px] left-[90px] w-[1292px] h-[727px] absolute aspect-[1.78] object-cover border border-theme-border/10"
          alt={t("blog.fieldImage", { values: { title: post.title } })}
          src={secondContentImage}
        />
      </article>
      <aside
        className="absolute top-[889px] left-[1469px] w-[377px] h-[361px]"
        aria-label={t("blog.categories")}
      >
        <div className="absolute top-0 left-0 w-[361px] h-[361px] bg-theme-card border border-theme-border/10 transition-colors" />
        <div className="absolute top-[55px] left-1.5 w-[346px] h-[3px] bg-theme-accent transition-colors" />
        <h2 className="absolute top-[15px] left-1.5 [font-family:'Clofie-Bold',Helvetica] font-bold text-theme-text text-[27px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors">
          {t("blog.categories")}
        </h2>
        <img
          className="absolute top-[9px] left-[321px] w-10 h-10 dark:invert-0 invert"
          alt={t("auto.singleblog.arrow.drop.left")}
          src="/single-blog/img/arrow-drop-left-1.svg"
        />
        {blogCategories.map((item, index) => {
          const top = 73 + index * 39;
          const boxTop = 71 + index * 39;

          return (
            <React.Fragment key={item}>
              <div
                className="absolute left-[42px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-text text-lg tracking-[0] leading-[normal] whitespace-nowrap transition-colors"
                style={{ top }}
              >
                {t(blogCategoryKey(item), { fallback: item })}
              </div>
              <div
                className="absolute left-1.5 w-[27px] h-[27px] border-[3px] border-solid border-theme-accent transition-colors"
                style={{ top: boxTop }}
              />
            </React.Fragment>
          );
        })}
      </aside>
      <aside
        className="absolute top-[1284px] left-[1469px] w-[367px] h-[361px]"
        aria-label={t("blog.latest")}
      >
        <div className="absolute top-0 left-0 w-[363px] h-[361px]">
          <div className="absolute top-0 left-0 w-[361px] h-[361px] bg-theme-card border border-theme-border/10 transition-colors" />
          <div className="absolute top-[55px] left-1.5 w-[346px] h-[3px] bg-theme-accent transition-colors" />
          <h2 className="absolute top-[15px] left-1.5 [font-family:'Clofie-Bold',Helvetica] font-bold text-theme-text text-[27px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors">
            {t("blog.latest")}
          </h2>
          <img
            className="absolute top-[9px] left-[321px] w-10 h-10 dark:invert-0 invert"
            alt={t("auto.singleblog.arrow.drop.left")}
            src="/single-blog/img/arrow-drop-left-1.svg"
          />
        </div>
        <div className="absolute top-[81px] left-1.5 w-[341px] h-[251px]">
          {visibleLatestBlogs.map((blog, index) => {
            const layout = latestBlogLayouts[index];

            return (
              <React.Fragment key={blog.slug}>
                <Link to={getBlogPostHref(blog)}>
                  <img
                    className={layout.imageClassName}
                    alt={blog.title}
                    src={blog.image}
                  />
                </Link>
                <div className={layout.dateClassName}>{blog.date}</div>
                <Link to={getBlogPostHref(blog)} className={layout.titleClassName}>
                  {blog.title}
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </aside>
      <div className="absolute top-[1686px] left-[1535px] [font-family:'Clofie-Bold',Helvetica] font-bold text-theme-heading text-3xl tracking-[0] leading-[normal] whitespace-nowrap transition-colors">
        {t("blog.social")}
      </div>
      <img
        className="absolute w-[260px] h-[45px] top-[1712px] left-[1502px] dark:opacity-100 opacity-80"
        alt={t("blog.social")}
        src="/single-blog/img/icon.png"
      />
      <section
        className="absolute top-[5999px] left-[90px] w-[1289px] h-[589px] bg-theme-card border border-theme-border/10 transition-colors"
        aria-label={t("blog.commentAria")}
      />
      <section aria-label={t("blog.comments", { values: { count: 2 } })}>
        <h2 className="absolute top-[6033px] left-[132px] [font-family:'Clofie-Bold',Helvetica] font-bold text-theme-text text-[27px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors">
          {t("blog.comments", { values: { count: 2 } })}
        </h2>
        {comments.map((comment) => (
          <div key={comment.id}>
            <img
              className={`absolute left-[214px] w-[66px] h-[66px] aspect-[1] rounded-full ${comment.avatarTop}`}
              alt={t("blog.authorAvatar")}
              src={comment.avatar}
            />
            <div
              className={`absolute left-[307px] [font-family:'Clofie-Bold',Helvetica] font-bold text-theme-text text-[27px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors ${comment.nameTop}`}
            >
              {comment.name}
            </div>
            <p
              className={`absolute left-[307px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-text/80 text-[21px] tracking-[0] leading-[normal] whitespace-pre-line transition-colors ${comment.messageTop}`}
            >
              {comment.message}
            </p>
            <button
              type="button"
              className={`absolute left-[1103px] w-28 h-10 bg-brand-green hover:bg-brand-greenDark text-white shadow-[0px_4px_4px_#00000040] transition-colors ${comment.replyButtonTop}`}
              aria-label={t("blog.replyTo", { values: { name: comment.name } })}
            />
            <div
              className={`absolute left-[1134px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-white text-lg tracking-[0] leading-[normal] pointer-events-none ${comment.replyTextTop}`}
            >
              {t("blog.reply")}
            </div>
          </div>
        ))}

        <img
          className="top-[6411px] left-[390px] w-[66px] h-[66px] absolute aspect-[1] rounded-full"
          alt={t("blog.replyAuthorAvatar")}
          src="/single-blog/img/286f1e83ef7372ad17b09ff60c8264c5-3.png"
        />
        <img
          className="absolute top-[6411px] left-[311px] w-[60px] h-[60px] dark:invert-0 invert"
          alt="Back"
          src="/single-blog/img/back.svg"
        />
        <p className="absolute top-[6400px] left-[475px] [font-family:'Clofie-Bold',Helvetica] font-bold text-theme-text text-[27px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors">{t("auto.singleblog.denvor.wayne.arthur")}</p>
        <p className="absolute top-[6442px] left-[475px] [font-family:'Glonimove-Regular',Helvetica] font-normal text-theme-text/80 text-[21px] tracking-[0] leading-[normal] transition-colors">{t("auto.singleblog.thank.you.very")}<br />{t("auto.singleblog.hope.you.have")}</p>
      </section>
      <section
        className="absolute top-[6637px] left-[90px] w-[1289px] h-[800px] bg-theme-card border border-theme-border/10 transition-colors"
        aria-label={t("blog.leaveComment")}
      >
        <h2 className="absolute top-[36px] left-[57px] [font-family:'Clofie-Bold',Helvetica] font-bold text-theme-text text-[27px] tracking-[0] leading-[normal] whitespace-nowrap transition-colors">
          {t("blog.leaveComment")}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="absolute top-[100px] left-[57px] w-[1181px] h-[555px]"
        >
          <div className="absolute top-0 left-0 w-[478px] h-[104px] bg-theme-sec border border-theme-border/20 transition-colors duration-200" />
          <div className="absolute top-0 left-[503px] w-[672px] h-[104px] bg-theme-sec border border-theme-border/20 transition-colors duration-200" />
          <div className="absolute top-[122px] left-0 w-[1175px] h-[344px] bg-theme-sec border border-theme-border/20 transition-colors duration-200" />
          <label
            htmlFor={nameId}
            className="top-[38px] left-9 absolute [font-family:'Google_Sans_Flex',Helvetica] font-bold text-theme-muted text-[21px] tracking-[0] leading-[normal] transition-colors"
          >
            {t("blog.yourName")}
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            aria-label={t("blog.yourName")}
            className="absolute top-0 left-0 w-[478px] h-[104px] px-9 pt-[22px] bg-transparent [font-family:'Google_Sans_Flex',Helvetica] font-bold text-theme-text text-[21px] tracking-[0] leading-[normal] outline-none"
          />
          <label
            htmlFor={emailId}
            className="top-[38px] left-[539px] absolute [font-family:'Google_Sans_Flex',Helvetica] font-bold text-theme-muted text-[21px] tracking-[0] leading-[normal] transition-colors"
          >
            {t("blog.yourEmail")}
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            aria-label={t("blog.yourEmail")}
            className="absolute top-0 left-[503px] w-[672px] h-[104px] px-9 pt-[22px] bg-transparent [font-family:'Google_Sans_Flex',Helvetica] font-bold text-theme-text text-[21px] tracking-[0] leading-[normal] outline-none"
          />
          <label
            htmlFor={messageId}
            className="top-[158px] left-9 absolute [font-family:'Google_Sans_Flex',Helvetica] font-bold text-theme-muted text-[21px] tracking-[0] leading-[normal] transition-colors"
          >
            {t("blog.yourMessage")}
          </label>
          <textarea
            id={messageId}
            name="message"
            value={formData.message}
            onChange={handleChange}
            aria-label={t("blog.yourMessage")}
            className="absolute top-[122px] left-0 w-[1175px] h-[344px] bg-transparent resize-none px-9 pt-[62px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-theme-text text-[21px] tracking-[0] leading-[normal] outline-none"
          />
          <button
            type="submit"
            className="absolute top-[484px] left-0 w-[362px] h-[71px] bg-brand-green hover:bg-brand-greenDark text-white shadow-[0px_4px_4px_#00000040] transition-colors duration-200"
            aria-label={t("blog.submitComment")}
          >
            <div className="w-[364px] h-[71px] relative flex items-center justify-between px-9">
              <span className="[font-family:'Google_Sans_Flex',Helvetica] font-bold text-white text-2xl tracking-[0] leading-[normal]">
                {t("blog.submitComment")}
              </span>
              <img
                className="w-[46px] h-[46px]"
                alt={t("auto.singleblog.transfer.long.right")}
                src="/single-blog/img/transfer-long-right.svg"
              />
            </div>
          </button>
        </form>
      </section>
      <section
        className="absolute top-[7590px] -left-px w-[1920px] h-[375px] overflow-hidden"
        aria-label={t("action.callUsNow")}
      >
        <div className="absolute top-[-82px] left-0 w-[1920px] h-[540px] bg-[#153d28]" />
        <div className="absolute w-[2275px] h-[580px] top-[-62px] -left-32">
          <div className="absolute top-px left-px w-[2275px] h-[580px]">
            <img
              className="absolute top-[62px] left-[1756px] w-[292px] h-[375px]"
              alt="House"
              src="/single-blog/img/house.svg"
            />
            <img
              className="absolute top-[62px] left-[129px] w-[201px] h-[350px]"
              alt="House"
              src="/single-blog/img/house-1.svg"
            />
            <div className="absolute top-[180px] left-[166px] w-[318px] h-[318px] bg-[#153d28] rounded-[159px] blur-[75px]" />
            <div className="absolute top-[186px] left-[1616px] w-[394px] h-[394px] bg-[#153d28] rounded-[159px] blur-[75px]" />
          </div>
          <div className="absolute top-[201px] left-[551px] w-[705px] h-[98px] flex gap-[46px]">
            <img
              className="w-[98.01px] h-[98.01px]"
              alt="Call"
              src="/single-blog/img/call.png"
            />
            <p className="mt-[1.0px] w-[559px] h-24 [font-family:'Readex_Pro',Helvetica] font-semibold text-transparent text-4xl tracking-[0] leading-[48px]">
              <span className="text-white">
                {t("blog.appointmentText")}{" "}
              </span>
              <a
                href="tel:+12132142203"
                rel={t("auto.singleblog.noopener.noreferrer")}
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
          rel={t("auto.singleblog.noopener.noreferrer")}
          target="_blank"
          className="absolute top-[150px] left-[1226px] w-[271px] h-[75px] flex border-4 border-solid border-[#d8c79a]"
          aria-label={t("blog.callUsNowAt", { values: { phone: "+1 213-214-2203" } })}
        >
          <div className="mt-[23px] w-[180px] ml-[50px] flex gap-[5px]">
            <div className="mt-0.5 w-[143px] h-[26px] [font-family:'Google_Sans_Flex',Helvetica] font-bold text-[#d8c79a] text-[21px] tracking-[0] leading-[normal]">
              {t("action.callUsNow")}
            </div>
            <div className="w-[30px] h-7 flex">
              <img
                className="flex-1 w-[9.65px]"
                alt="Vector"
                src="/single-blog/img/vector-9.svg"
              />
            </div>
          </div>
        </a>
      </section>
    </main>
    </AnimaScaler>
  );
};
