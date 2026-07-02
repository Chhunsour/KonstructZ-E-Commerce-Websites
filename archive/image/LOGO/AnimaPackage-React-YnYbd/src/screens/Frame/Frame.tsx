const frameImages = {
  logo: {
    src: "/img/vector.png",
    alt: "KONSTRUCTZ wolf logo",
    className: "mt-[-52.6px] ml-[-82.1px] h-[1118.31px] w-[995.88px] shrink-0",
  },
  wordmark: {
    src: "/img/scoopy-dig-png-3-1-5.png",
    alt: "KONSTRUCTZ",
    className: "h-[435px] w-[2639px] aspect-[6.07] shrink-0",
  },
  tagline: {
    src: "/img/construct-the-future.png",
    alt: "Construct the Future",
    className: "ml-[13.2px] h-[205.2px] w-[2629.06px] shrink-0",
  },
};

export const Frame = (): JSX.Element => {
  return (
    <main
      className="w-full overflow-x-auto"
      data-model-id="2468:6012"
      aria-label="Konstructz brand hero"
    >
      <section className="flex min-h-[1022px] min-w-[3740px] gap-[172.2px]">
        <img
          className={frameImages.logo.className}
          alt={frameImages.logo.alt}
          src={frameImages.logo.src}
          draggable={false}
        />
        <div className="mt-[76px] flex h-[806px] w-[2656px] flex-col gap-[87.5px]">
          <img
            className={frameImages.wordmark.className}
            alt={frameImages.wordmark.alt}
            src={frameImages.wordmark.src}
            draggable={false}
          />
          <img
            className={frameImages.tagline.className}
            alt={frameImages.tagline.alt}
            src={frameImages.tagline.src}
            draggable={false}
          />
        </div>
      </section>
    </main>
  );
};
