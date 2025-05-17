// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Leva } from "leva";
import { Loader } from "@react-three/drei";

import HomePage            from "./components/HomePage.jsx";
import Choose              from "./components/Choose.jsx";
import InterestsSurvey     from "./components/InterestSurvey.jsx";
import Instructions        from "./components/Instructions.jsx";
import Prequiz             from "./components/Prequiz.jsx";
import Postquiz            from "./components/Postquiz.jsx";
import Evaluation          from "./components/Evaluation.jsx";
import Preview             from "./components/Preview.jsx";
import Introduction        from "./components/Introduction.jsx";
import IntroductionVideo   from "./components/IntroductionVideo.jsx";

import Science             from "./components/lesson-plan/Science.jsx";
import Technology          from "./components/lesson-plan/Technology.jsx";
import Engineering         from "./components/lesson-plan/Engineering.jsx";
import Mathematics         from "./components/lesson-plan/Mathematics.jsx";

import AvatarPage          from "./components/AvatarPage.jsx";
import ExplainingAvatar    from "./components/ExplainingAvatar.jsx";
import PointingUpTester    from "./components/PointingUpTester.jsx";
import UI                  from "./components/UI.jsx";

import HandTenonMech       from "./components/HandTenonMech.jsx";
import GifQuiz             from "./components/GifQuiz.jsx"; // ✅ Added import

export default function App() {
  const location = useLocation();
  const canvasRoutes = [
    "/avatar", "/avatar1", "/avatar2", "/avatar4",
    "/explaining", "/point", "/teacher2"
  ];
  const isCanvasRoute = canvasRoutes.includes(location.pathname);

  return (
    <>
      <Loader />
      <Leva hidden />
      {!isCanvasRoute && <UI />}

      <Routes>
        {/* Non-canvas pages */}
        <Route path="/"                     element={<HomePage />} />
        <Route path="/homepage"             element={<HomePage />} />
        <Route path="/choose"               element={<Choose />} />
        <Route path="/interests-survey"     element={<InterestsSurvey />} />
        <Route path="/instructions"         element={<Instructions />} />
        <Route path="/prequiz"              element={<Prequiz />} />
        <Route path="/gifquiz"              element={<GifQuiz />} /> {/* ✅ Added route */}
        <Route path="/postquiz"             element={<Postquiz />} />
        <Route path="/evaluation"           element={<Evaluation />} />
        <Route path="/preview"              element={<Preview />} />
        <Route path="/introduction"         element={<Introduction />} />
        <Route path="/introduction-video"   element={<IntroductionVideo />} />

        {/* Lesson-plan pages */}
        <Route path="/lesson-plan/science"     element={<Science />} />
        <Route path="/lesson-plan/technology"  element={<Technology />} />
        <Route path="/lesson-plan/engineering" element={<Engineering />} />
        <Route path="/lesson-plan/mathematics" element={<Mathematics />} />

        {/* New Hand-Tendon Mechanism page */}
        <Route path="/hand-tenon-mech"     element={<HandTenonMech />} />

        {/* Canvas-based avatars */}
        <Route path="/avatar"     element={<AvatarPage />} />
        <Route path="/avatar1"    element={<AvatarPage />} />
        <Route path="/avatar2"    element={<AvatarPage />} />
        <Route path="/avatar4"    element={<AvatarPage />} />
        <Route path="/teacher2"   element={<AvatarPage />} />

        {/* Other three-js demos */}
        <Route path="/explaining" element={<ExplainingAvatar />} />
        <Route path="/point"      element={<PointingUpTester />} />

        {/* Fallback 404 */}
        <Route path="*" element={<p>404: Page not found</p>} />
      </Routes>
    </>
  );
}
