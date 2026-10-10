export default function CourierScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 520 400"
      className={className}
      role="img"
      aria-label="A Cee's Deliveries van carrying food, groceries and parcels along a route"
      fill="none"
    >
      {/* backdrop */}
      <circle cx="268" cy="186" r="168" fill="#ffffff" fillOpacity="0.08" />
      <circle cx="268" cy="186" r="118" fill="#ffffff" fillOpacity="0.06" />

      {/* route + pin */}
      <path
        d="M96 128 C 196 44, 330 48, 424 96"
        stroke="#ffffff"
        strokeOpacity="0.65"
        strokeWidth="3"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <g>
        <path
          d="M424 66 c-13.5 0-23 9.6-23 22.3 0 15 23 35.7 23 35.7s23-20.7 23-35.7C447 75.6 437.5 66 424 66Z"
          fill="#FF5B61"
        />
        <circle cx="424" cy="88" r="8" fill="#ffffff" />
      </g>

      {/* confetti */}
      <circle cx="86" cy="86" r="6" fill="#FFC247" />
      <circle cx="470" cy="196" r="5" fill="#FF5B61" />
      <circle cx="150" cy="52" r="4" fill="#ffffff" fillOpacity="0.8" />
      <rect x="452" y="128" width="12" height="12" rx="3" fill="#FFC247" transform="rotate(24 458 134)" />
      <rect x="60" y="176" width="10" height="10" rx="3" fill="#ffffff" fillOpacity="0.7" transform="rotate(-18 65 181)" />

      {/* road */}
      <rect x="-24" y="322" width="568" height="86" rx="43" fill="#211D35" fillOpacity="0.16" />
      <line
        x1="-24"
        y1="362"
        x2="544"
        y2="362"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="4"
        strokeDasharray="30 26"
        strokeLinecap="round"
      />

      {/* ground shadow */}
      <ellipse cx="250" cy="350" rx="188" ry="13" fill="#211D35" fillOpacity="0.22" />

      {/* motion lines */}
      <g stroke="#ffffff" strokeOpacity="0.55" strokeWidth="9" strokeLinecap="round">
        <line x1="-10" y1="206" x2="40" y2="206" />
        <line x1="4" y1="240" x2="54" y2="240" />
        <line x1="-10" y1="274" x2="30" y2="274" />
      </g>

      {/* wheels */}
      <g className="animate-drive" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="146" cy="316" r="35" fill="#211D35" />
        <circle cx="146" cy="316" r="15" fill="#F0ECFF" />
        <circle cx="146" cy="316" r="6" fill="#211D35" />
        <circle cx="366" cy="316" r="35" fill="#211D35" />
        <circle cx="366" cy="316" r="15" fill="#F0ECFF" />
        <circle cx="366" cy="316" r="6" fill="#211D35" />
      </g>

      {/* van body */}
      <path
        d="M60 300 V190 q0-26 26-26 H300 q10 0 16 8 l58 78 q7 9 7 20 v30 q0 20-20 20 H80 q-20 0-20-20 Z"
        fill="#211D35"
      />

      {/* cargo panel */}
      <rect x="84" y="186" width="198" height="86" rx="15" fill="#ffffff" fillOpacity="0.14" />

      {/* cargo icons: parcel, grocery bag, food */}
      <g stroke="#ffffff" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round">
        {/* parcel */}
        <rect x="106" y="206" width="40" height="40" rx="8" fill="#ffffff" fillOpacity="0.16" />
        <line x1="126" y1="206" x2="126" y2="246" />
        <line x1="106" y1="222" x2="146" y2="222" />
        {/* grocery bag */}
        <path d="M170 216 a12 12 0 0 1 24 0" fill="none" />
        <path
          d="M168 216 h28 l4 30 h-36 Z"
          fill="#ffffff"
          fillOpacity="0.18"
          strokeLinejoin="round"
        />
        {/* food box */}
        <path
          d="M232 216 h40 l-5 30 h-30 Z"
          fill="#ffffff"
          fillOpacity="0.18"
          strokeLinejoin="round"
        />
        <path d="M232 216 l7-9 h26 l7 9" fill="none" />
      </g>

      {/* windshield */}
      <path d="M306 184 L352 236 L306 236 Z" fill="#C9DDFF" />
      {/* driver silhouette */}
      <circle cx="330" cy="210" r="10" fill="#211D35" />
      <path d="M316 236 q14-16 28 0 Z" fill="#211D35" />

      {/* headlight */}
      <circle cx="392" cy="268" r="22" fill="#FFC247" fillOpacity="0.25" />
      <rect x="384" y="260" width="18" height="16" rx="8" fill="#FFC247" />

      {/* bumper */}
      <rect x="404" y="280" width="16" height="30" rx="7" fill="#12101D" />

      {/* floating parcel top-left */}
      <g className="animate-float-slow" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x="52" y="212" width="52" height="52" rx="12" fill="#FFC247" transform="rotate(-14 78 238)" />
        <line x1="68" y1="216" x2="88" y2="200" stroke="#ffffff" strokeWidth="4" transform="rotate(-14 78 238)" />
      </g>

      {/* floating grocery bag top-right */}
      <g className="animate-float" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path d="M418 150 a14 14 0 0 1 28 0" stroke="#F0ECFF" strokeWidth="4" fill="none" />
        <path d="M414 150 h36 l5 40 h-46 Z" fill="#F0ECFF" />
        <circle cx="432" cy="168" r="5" fill="#211D35" />
      </g>
    </svg>
  );
}
