  import type { SVGProps } from 'react';
  import ultrasonic from "../icon/ultrasonic.png"
  export function Logo(props:any) {
    return (
      // <svg
      //   xmlns="http://www.w3.org/2000/svg"
      //   viewBox="0 0 24 24"
      //   fill="none"
      //   stroke="currentColor"
      //   strokeWidth="2"
      //   strokeLinecap="round"
      //   strokeLinejoin="round"
      //   {...props}
      // >
      //   <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-5.5-4-4.5 2.5-5.5 4-3 3.5-3 5.5a7 7 0 0 0 7 7zm0-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      // </svg>
      <img src={ultrasonic.src} alt="" {...props}/>
  );
}
