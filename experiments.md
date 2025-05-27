---
layout: default
title: Ben Jennings
description: A collection of projects by Ben Jennings
body_class: "page-container"
---
    <site-navigation></site-navigation>

    <main>
      <header class="page-title">
        <h1 class="heading">Experiments</h1>
        <p class="body lg secondary">A place that I can test new ideas</p>
      </header>

      <div class="page-items">
        <article class="card">
          <h1 class="title">Hello</h1>
        </article>
        <simple-card title="Gradients" version="box">
          <div slot="media" class="gradient"></div>

          <div slot="post" class="post-body">
            <div class="gradient"></div>
            <div class="gradient rgb"></div>
            <div class="gradient hsl"></div>
            <div>
              <theme-slider class="quick-theme" data-hide-label></theme-slider>

            </div>
          </div>
        </simple-card>

        <model-viewer style="
              height: 100%;
              border: 1px solid var(--color-border-primary);
              background-color: var(--color-background-primary);
            " poster="/assets/resources/Experiments/poster.webp" auto-rotate rotation-per-second="-20deg"
          shadow-intensity="0.77" exposure="1.51" camera-orbit="180.3deg 82.74deg 1.091m" field-of-view="19.98deg"
          camera-controls tone-mapping="neutral" shadow-softness="0.78" shadow-softness="1"
          src="/assets/resources/Scaniverse 2024-05-08 120226.glb"></model-viewer>

        <simple-card title="Plant" version="box">
          <model-viewer slot="media" poster="/assets/resources/Experiments/poster.webp" rotation-per-second="-20deg"
            shadow-intensity="0.77" exposure="1.51" camera-orbit="180.3deg 82.74deg 1.091m" field-of-view="19.98deg"
            auto-rotate tone-mapping="neutral" shadow-softness="0.78" shadow-softness="1"
            src="/assets/resources/ball.gltf"></model-viewer>

          <div slot="post" class="post-body horizontal">
            <p class="full-row">
              I made this by simply taking a bunch of photos from every angle
              and processing it into 3d object
            </p>

            <model-viewer class="full-row model" width="100%" height="100%" disable-zoom camera-controls
              rotation-per-second="-20deg" shadow-intensity="0.77" exposure="1.51"
              camera-orbit="180.3deg 82.74deg 1.091m" field-of-view="19.98deg" auto-rotate tone-mapping="neutral"
              rotation-per-second="40deg" shadow-softness="1" src="/assets/resources/ball.gltf"></model-viewer>
          </div>

          <div slot="badge" class="badge">
            <span>view_in_ar</span>
            3D Scan
          </div>

          Don't make it simple, make it clear
        </simple-card>

        <simple-card title="Spline" version="box">
          <spline-viewer slot="media"
            url="https://prod.spline.design/JFdKLEEFV4sfOXrM/scene.splinecode"></spline-viewer>

          <div slot="post" class="post-body horizontal">
            <!-- Link the Spline viewer module -->
            <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.35/build/spline-viewer.js"></script>

            <spline-viewer url="https://prod.spline.design/JFdKLEEFV4sfOXrM/scene.splinecode" events-target="global"
              background="rgba(0,0,0,0.1)"></spline-viewer>
          </div>

          <div slot="badge" class="badge">
            <span>view_in_ar</span>
            3D Scan
          </div>

          Don't make it simple, make it clear
        </simple-card>

        <simple-card title="A better digital frame" version="box">
          <img src="/assets/resources/Experiments/frame/frame2.webp" slot="media" />

          <div slot="post" class="post-body grid">
            <img class="full-row" src="/assets/resources/Experiments/frame/frame2.webp" />

            <div class="full-row">
              <p>
                I have always found e-ink so fascinating. The way that a lot
                of people have experienced e-ink is with a Kindle. When I
                discovered that the technology had advanced to have colors, I
                thought it would be perfect for a digital(ish) photo frame.
              </p>

              <p>
                The types of digital frames that a lot of people have use LCD
                screens with a pretty bright backlight. They feel tacky and
                draw too much attention than they need to.
              </p>

              <p>
                Currently this is work in progress with only a proof of
                concept UI. I plan on continuing to iterate on the design and
                to find frame that can hold all of the computer parts.
              </p>
            </div>

            <img src="/assets/resources/Experiments/frame/frame1.webp" />
            <img src="/assets/resources/Experiments/frame/frame3.webp" />
            <img src="/assets/resources/Experiments/frame/frame4.webp" />
          </div>

          <div slot="badge" class="badge">
            <span>construction</span>
            Work in progress
          </div>
          <div slot="badge" class="badge">
            <span>developer_board</span>
            Hardware
          </div>

          Don't make it simple, make it clear
        </simple-card>
      </div>
    </main>


