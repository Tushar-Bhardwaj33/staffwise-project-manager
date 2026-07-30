import React from 'react';
import type { IUser } from "../../types/user.type";
import { Link } from "react-router-dom";

interface ContactCardProps {
  user: IUser;
}

export const ContactCard: React.FC<ContactCardProps> = ({ user }) => {
  return (
    <Link to={`/admin/employees/${user._id}`} className="block">
      <div className="profile-card w-full sm:w-[300px] rounded-md shadow-xl overflow-hidden z-[10] relative cursor-pointer snap-start shrink-0 bg-white flex flex-col items-center justify-center gap-3 transition-all duration-300 group hover:shadow-2xl border border-gray-100 mx-auto">
        <div className="avatar w-full pt-5 flex items-center justify-center flex-col gap-1">
          <div className="img_container w-full flex items-center justify-center relative z-40 after:absolute after:h-[6px] after:w-full after:bg-[#20beff] after:top-4 after:group-hover:size-[1%] after:delay-300 after:group-hover:delay-0 after:group-hover:transition-all after:group-hover:duration-300 after:transition-all after:duration-300 before:absolute before:h-[6px] before:w-full before:bg-[#20beff] before:bottom-4 before:group-hover:size-[1%] before:delay-300 before:group-hover:delay-0 before:group-hover:transition-all before:group-hover:duration-300 before:transition-all before:duration-300">
            {/* The SVG Avatar from the prompt */}
            <svg className="size-36 z-40 border-4 border-white rounded-full group-hover:border-8 group-hover:transition-all group-hover:duration-300 transition-all duration-300 bg-gray-50" id="avatar" viewBox="0 0 61.8 61.8" xmlns="http://www.w3.org/2000/svg">
              <g data-name="Layer 2">
                <g data-name="\u2014\u00CE\u00D3\u00C8 1">
                  <path d="M31.129 8.432c21.281 0 12.987 35.266 0 35.266-12.266 0-21.281-35.266 0-35.266z" fillRule="evenodd" fill="#ffe8be" />
                  <circle fill="#20beff" r="30.9" cy="30.9" cx="30.9" />
                  <path d="M45.487 19.987l-29.173.175s1.048 16.148-2.619 21.21h35.701c-.92-1.35-3.353-1.785-3.909-21.385z" fillRule="evenodd" fill="#60350a" />
                  <path d="M18.135 45.599l7.206-3.187 11.55-.3 7.42 3.897-5.357 11.215-7.613 4.088-7.875-4.35-5.331-11.363z" fillRule="evenodd" fill="#d5e1ed" />
                  <path d="M24.744 38.68l12.931.084v8.949l-12.931-.085V38.68z" fillRule="evenodd" fill="#f9dca4" />
                  <path opacity=".11" d="M37.677 38.778v3.58a9.168 9.168 0 0 1-.04 1.226 6.898 6.898 0 0 1-.313 1.327c-4.37 4.165-11.379.78-12.49-6.333z" fillRule="evenodd" />
                  <path d="M52.797 52.701a30.896 30.896 0 0 1-44.08-.293l1.221-3.098 9.103-4.122c3.262 5.98 6.81 11.524 12.317 15.455A45.397 45.397 0 0 0 43.2 45.483l8.144 3.853z" fillRule="evenodd" fill="#434955" />
                  <path d="M19.11 24.183c-2.958 1.29-.442 7.41 1.42 7.383a30.842 30.842 0 01-1.42-7.383zM43.507 24.182c2.96 1.292.443 7.411-1.419 7.384a30.832 30.832 0 001.419-7.384z" fillRule="evenodd" fill="#f9dca4" />
                  <path d="M31.114 8.666c8.722 0 12.377 6.2 12.601 13.367.307 9.81-5.675 21.43-12.6 21.43-6.56 0-12.706-12.018-12.333-21.928.26-6.953 3.814-12.869 12.332-12.869z" fillRule="evenodd" fill="#ffe8be" />
                  <path d="M33.399 24.983a7.536 7.536 0 0 1 5.223-.993h.005c5.154.63 5.234 2.232 4.733 2.601a2.885 2.885 0 0 0-.785 1.022 6.566 6.566 0 0 1-1.052 2.922 5.175 5.175 0 0 1-3.464 2.312c-.168.027-.34.048-.516.058a4.345 4.345 0 0 1-3.65-1.554 8.33 8.33 0 0 1-1.478-2.53v.003s-.797-1.636-2.072-.114a8.446 8.446 0 0 1-1.52 2.64 4.347 4.347 0 0 1-3.651 1.555 5.242 5.242 0 0 1-.516-.058 5.176 5.176 0 0 1-3.464-2.312 6.568 6.568 0 0 1-1.052-2.921 2.75 2.75 0 0 0-.77-1.023c-.5-.37-.425-1.973 4.729-2.603h.002a7.545 7.545 0 0 1 5.24 1.01l-.001-.001.003.002.215.131a3.93 3.93 0 0 0 3.842-.148l-.001.001zm-4.672.638a6.638 6.638 0 0 0-6.157-.253c-1.511.686-1.972 1.17-1.386 3.163a5.617 5.617 0 0 0 .712 1.532 4.204 4.204 0 0 0 3.326 1.995 3.536 3.536 0 0 0 2.966-1.272 7.597 7.597 0 0 0 1.36-2.37c.679-1.78.862-1.863-.82-2.795zm10.947-.45a6.727 6.727 0 0 0-5.886.565c-1.538.911-1.258 1.063-.578 2.79a7.476 7.476 0 0 0 1.316 2.26 3.536 3.536 0 0 0 2.967 1.272 4.228 4.228 0 0 0 .43-.048 4.34 4.34 0 0 0 2.896-1.947 5.593 5.593 0 0 0 .684-1.44c.702-2.25.076-2.751-1.828-3.451z" fillRule="evenodd" fill="#464449" />
                  <path d="M17.89 25.608c0-.638.984-.886 1.598 2.943a22.164 22.164 0 0 0 .956-4.813c1.162.225 2.278 2.848 1.927 5.148 3.166-.777 11.303-5.687 13.949-12.324 6.772 3.901 6.735 12.094 6.735 12.094s.358-1.9.558-3.516c.066-.538.293-.733.798-.213C48.073 17.343 42.3 5.75 31.297 5.57c-15.108-.246-17.03 16.114-13.406 20.039z" fillRule="evenodd" fill="#8a5c42" />
                  <path d="M24.765 42.431a14.125 14.125 0 0 0 6.463 5.236l-4.208 6.144-5.917-9.78z" fillRule="evenodd" fill="#fff" />
                  <path d="M37.682 42.431a14.126 14.126 0 0 1-6.463 5.236l4.209 6.144 5.953-9.668z" fillRule="evenodd" fill="#fff" />
                  <circle fill="#434955" r=".839" cy="52.562" cx="31.223" />
                  <circle fill="#434955" r=".839" cy="56.291" cx="31.223" />
                  <path d="M41.997 24.737c1.784.712 1.719 1.581 1.367 1.841a2.886 2.886 0 0 0-.785 1.022 6.618 6.618 0 0 1-.582 2.086v-4.949zm-21.469 4.479a6.619 6.619 0 0 1-.384-1.615 2.748 2.748 0 0 0-.77-1.023c-.337-.249-.413-1.06 1.154-1.754z" fillRule="evenodd" fill="#464449" />
                </g>
              </g>
            </svg>
            <div className="absolute bg-[#20beff] z-10 size-[60%] w-full group-hover:size-[1%] group-hover:transition-all group-hover:duration-300 transition-all duration-300 delay-700 group-hover:delay-0" />
          </div>
        </div>
        <div className="headings *:text-center *:leading-4 px-4 w-full">
          <p className="text-xl font-serif font-semibold text-[#0f1419] uppercase truncate" title={user.name}>{user.name}</p>
          <p className="text-sm font-semibold text-[#5b6b79] uppercase">{user.role}</p>
        </div>
        <div className="w-full items-center justify-center flex px-4">
          <ul className="w-full flex flex-col items-start gap-2 has-[:last]:border-b-0 *:inline-flex *:gap-2 *:items-center *:justify-start *:border-b-[1.5px] *:border-b-stone-200 *:border-dotted *:text-xs *:font-semibold *:text-[#5b6b79] pb-3">
            <li className="w-full pb-1">
              <svg id="id-card" viewBox="0 0 24 24" className="fill-stone-400 group-hover:fill-[#20beff]" height={15} width={15} xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M4 6h16v12H4V6zm2 2v8h12V8H6zm3 2h6v2H9v-2z" />
              </svg>
              <p className="truncate">ID: {user.employeeId}</p>
            </li>
            <li className="w-full pb-1">
              <svg className="fill-stone-400 group-hover:fill-[#20beff]" height={15} width={15} id="mail" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M16,14.81,28.78,6.6A3,3,0,0,0,27,6H5a3,3,0,0,0-1.78.6Z" />
                <path d="M16.54,16.84h0l-.17.08-.08,0A1,1,0,0,1,16,17h0a1,1,0,0,1-.25,0l-.08,0-.17-.08h0L2.1,8.26A3,3,0,0,0,2,9V23a3,3,0,0,0,3,3H27a3,3,0,0,0,3-3V9a3,3,0,0,0-.1-.74Z" />
              </svg>
              <p className="truncate" title={user.email}>{user.email}</p>
            </li>
            <li className="w-full pb-1">
              <svg className="fill-stone-400 group-hover:fill-[#20beff]" height={15} width={15} id="calendar" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
              </svg>
              <p>Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })}</p>
            </li>
            <li className="w-full pb-1">
              <svg id="skills" viewBox="0 0 24 24" className="fill-stone-400 group-hover:fill-[#20beff]" height={15} width={15} xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" />
              </svg>
              <p className="truncate" title={user.skills?.join(', ') || 'No skills listed'}>
                {user.skills && user.skills.length > 0 ? user.skills.join(', ') : 'No skills listed'}
              </p>
            </li>
          </ul>
        </div>
        <hr className="w-full group-hover:h-5 h-3 bg-[#20beff] border-none group-hover:transition-all group-hover:duration-300 transition-all duration-300 m-0 p-0" />
      </div>
    </Link>
  );
}
