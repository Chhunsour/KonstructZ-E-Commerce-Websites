const contactItems = [
  {
    title: "Email",
    top: "top-[147px]",
    contentTop: "top-[200px]",
    content: ["support@konstructz.com", "sales@konstructz.com"],
  },
  {
    title: "Phone Number",
    top: "top-[334px]",
    contentTop: "top-[387px]",
    content: ["(+1) 234 32 324 324"],
  },
  {
    title: "Location",
    top: "top-[481px]",
    contentTop: "top-[534px]",
    content: ["2522 S Malt Ave., Commerce, CA 90040, United States."],
    widthClass: "w-[393px]",
    multiline: true,
  },
];

const productDescription = `GTIN: 5061030742112

The TYPHON TERROR X2 MAX 2.7 Ton Mini Excavator is a compact, versatile mini excavator designed for tight spaces and precision work in residential, landscaping, and small construction projects. With a 2.7-ton operating weight and a slim 1,060 mm body width, it delivers excellent stability and easy access to narrow job sites.

It offers a maximum digging depth of 2,915 mm, 360° body swing, and a 430 mm bucket for efficient and accurate excavation. Equipped with a Danfoss traveling motor and a 0.07 m³ bucket capacity, it handles trenching, drainage, foundation work, and material handling with strong and reliable performance.

Powered by a 17.3 kW Yanmar 3TNV88F diesel engine and supported by a 16 L fuel tank and 22 L hydraulic tank, the machine combines power, efficiency, and long-term durability. Operator-friendly features such as a safety lock, swing boom, track telescope switch, LED lighting, intuitive controls, and a 3.4 km/h travel speed ensure safe, precise, and efficient operation on any job site.

TYPHON TERROR X2 MAX Key Features:

1. Ideal for Tight-Space Tasks:

The TYPHON TERROR X2 MAX is engineered for precision work in confined environments, including residential sites, landscaping projects, utility trenches, and small construction zones.

Its compact size and 1,060 mm body width allow easy access through narrow pathways while maintaining excellent stability. Strong digging performance is provided by a 2,915 mm maximum digging depth, 4,570 mm digging radius, and 2,260 mm maximum unloading height. The 430 mm bucket width ensures controlled excavation with high accuracy.

A full 360° body swing, tight swing radius, and boom swing angle of 55° left and 45° right allow smooth operation in restricted spaces. The durable undercarriage features 230 mm wide tracks with a 1,650 mm track length for reliable traction and balance.

An integrated dozer blade improves grading and stability, offering a 297 mm digging depth and 230 mm lifting height. Overall dimensions of 4000 × 1350 × 2280 mm make transportation and storage simple and efficient.

2. One Machine, So Many Uses:

Built to handle a wide range of tasks, the TYPHON TERROR X2 MAX delivers efficiency and reliability across different working conditions. The Danfoss traveling motor ensures smooth travel and precise control on varied terrain.

With an excavator boom lifting force of 400 kg, a digging force of 22 kN, a main system flow of 26 L/min, and a travel speed of 3.4 km/h, the machine combines strength with agility. Its 0.07 m³ bucket capacity is well-suited for trenching, landscaping, drainage, foundation work, and material handling.

The machine also supports multiple attachments, enabling digging, trenching, lifting, breaking, and site cleanup. This versatility allows one compact machine to complete multiple tasks efficiently, saving time, space, and operating costs.

3. Strong but Compact Design:

The TYPHON TERROR X2 MAX combines compact dimensions with dependable power for demanding work in limited spaces. It is powered by the Yanmar 3TNV88F diesel engine, producing 17.3 kW (23.2 HP@ 2200rpm) of efficient, low-emission performance.

Its 1.642-liter, 3-cylinder inline design provides smooth operation, strong torque, and excellent fuel economy through direct injection and natural aspiration. The hydraulic system features a 13 L/min pilot flow and a high-quality Danfoss swing motor, delivering smooth rotation at a 10 r/min swing speed.

A 16-liter fuel tank and 22-liter hydraulic oil tank support long working hours with fewer refueling interruptions. The telescopic undercarriage with a track range of 1,060–1,350 mm improves stability during operation while maintaining compact access when needed. Simplified maintenance and well-positioned lubrication points enhance durability and long-term productivity.

4. Easy Control:

The TYPHON TERROR X2 MAX is designed for operator comfort, safety, and ease of use. Pilot and full hydraulic controls allow smooth, precise operation for digging, lifting, and positioning tasks. A built-in safety lock system enables immediate machine shutdown when engaged, reducing the risk of accidental operation.

Switch buttons for the swing boom and track telescope functions allow quick adjustments without interrupting workflow. The AC/heater cabin with an openable front window ensures operator comfort in all weather conditions, while bright LED lights improve visibility in low-light environments.

An intuitive control panel places all essential functions within easy reach, minimizing learning time and improving efficiency. With a 3.4 km/h travel speed, the TERROR X2 MAX moves smoothly around the job site, reducing repositioning time and keeping projects on schedule.

5. Gear Included:

Comes with 1 x standard digging excavator bucket, 1 x hydraulic oil cooler, and 1 x hydraulic thumb clip.

Includes 1 x toolbox, 1 x cabin (AC/heater), and 1 x digital manual with comprehensive instructions.

Additional Features:

√ Yanmar 3-Cylinder Diesel Engin
√ Retractable Undercarriage (1,060–1,350 mm)
√ Cabin with A/C & Heater
√ Pilot Control System
√ Boom Swing Function
√ 360° Full Rotation
√ Fully Hydraulic System Control

Why Choose TYPHON MACHINERY?

Customer Assurance: We provide responsive service and reliable parts support to ensure your machine runs smoothly for years.

Performance You Can Trust: Every TYPHON excavator is built with premium components for durability, performance, and operator safety.

Global Reliability: Trusted by contractors and builders across the USA and beyond for delivering consistent quality and efficiency.

Your construction projects will reach new heights with the TYPHON TERROR X2 MAX 2.7 Ton Mini Excavator. Compact, tough, and efficient, this trench digger machine is your ideal companion for successful projects at a mini scale.

Trust TYPHON Machinery for reliability, toughness, and performance that surpass expectations. Elevate your construction game with the TYPHON TERROR X2 MAX 2.7 Ton Mini Excavator – The TYPHON Terror X2 Max is the ultimate solution for all your excavation needs!`;

export const ProductDescriptionSection = (): JSX.Element => {
  return (
    <section
      aria-labelledby="product-description-heading"
      className="absolute top-[2725px] left-[90px] h-[2613px] w-[1740px]"
    >
      <div className="absolute left-px top-0 [font-family:'Clofie-Bold',Helvetica] text-[45px] font-bold leading-[normal] tracking-[0] text-white whitespace-nowrap">
        <h2 id="product-description-heading">Product Description</h2>
      </div>
      <div className="absolute left-[1347px] top-0 [font-family:'Clofie-Bold',Helvetica] text-[45px] font-bold leading-[normal] tracking-[0] text-white whitespace-nowrap">
        <h2 id="need-help-heading">Need Help?</h2>
      </div>
      <div
        aria-hidden="true"
        className="absolute left-px top-[83px] h-1.5 w-[1292px] bg-[#d9d9d9]"
      />
      <div
        aria-hidden="true"
        className="absolute left-0 top-[2607px] h-1.5 w-[1292px] bg-[#d9d9d9]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[1347px] top-[83px] h-1.5 w-[393px] bg-[#d9d9d9]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[1347px] top-[2607px] h-1.5 w-[393px] bg-[#d9d9d9]"
      />
      <article
        aria-label="Product details"
        className="absolute left-px top-[122px] w-[1289px] [font-family:'undefined-Regular',Helvetica] text-[27px] font-normal leading-[normal] tracking-[0] text-white whitespace-pre-line"
      >
        {productDescription}
      </article>
      <address aria-labelledby="need-help-heading" className="not-italic">
        {contactItems.map((item) => (
          <div key={item.title}>
            <h3
              className={`absolute left-[1347px] ${item.top} [font-family:'Glonimove-Bold',Helvetica] text-[33px] font-bold leading-[normal] tracking-[0] text-white whitespace-nowrap`}
            >
              {item.title}
            </h3>
            <div
              className={`absolute ${item.title === "Phone Number" ? "left-[1346px]" : "left-[1347px]"} ${item.contentTop} ${item.widthClass ?? ""} [font-family:'Glonimove-Regular',Helvetica] text-[33px] font-normal leading-[normal] tracking-[0] text-[#e8e8e8] ${item.multiline ? "" : "whitespace-nowrap"}`}
            >
              {item.content.map((line, index) => (
                <div key={`${item.title}-${index}`}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </address>
    </section>
  );
};
