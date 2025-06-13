diff --git a/src/components/RoomNarrativeOverlay.jsx b/src/components/RoomNarrativeOverlay.jsx
index 9392c8399835bedc3e9722a1b8760a90065db208..9b2cab8c97842adc535ca83176f147e775462682 100644
--- a/src/components/RoomNarrativeOverlay.jsx
+++ b/src/components/RoomNarrativeOverlay.jsx
@@ -1,37 +1,37 @@
 import React from "react";
 import "./styles/Map.css"; // You can replace this with Overlay.css later if needed
 
 function RoomNarrativeOverlay({ roomName, onContinue }) {
   const introText = {
     "Mr. Watkins' Room": [
       "You push open the door to Mr. Watkins' classroom. It's eerily quiet.",
       "Dust floats in the light. Papers are scattered across the desks.",
       "You step inside, unsure if you're alone…"
     ],
-    "Mrs. John's Room": [
-      "A faint tapping echoes through the hallway as you approach Mrs. John's room.",
-      "The door creaks open… there's a strong smell of cleaning fluid and something else.",
-      "Better be quick in here."
-    ],
+    "Mrs. John's Room": [
+      "You head further into the Languages corridor. Mrs. John's classroom is barely lit.",
+      "Desks are overturned and chairs are jammed against the back of the door. You squeeze through.",
+      "There's a faint buzzing—maybe the lights? Or something else. You need to scavenge supplies quickly and quietly."
+    ],
     "Mrs. Roche's Room": [
       "The air feels heavier as you reach Mrs. Roche's classroom.",
       "Something doesn't feel right. You hear movement inside.",
       "You grip your bag tighter. This could be trouble."
     ]
   };
 
   const lines = introText[roomName] || ["You enter the room…"];
 
   return (
     <div className="overlay-bg">
       <div className="overlay-box">
         {lines.map((line, index) => (
           <p key={index}>{line}</p>
         ))}
         <button onClick={onContinue}>Continue</button>
       </div>
     </div>
   );
 }
 
 export default RoomNarrativeOverlay;
