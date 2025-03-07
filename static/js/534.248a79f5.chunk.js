/*! For license information please see 534.248a79f5.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkchat_app=self.webpackChunkchat_app||[]).push([[534],{7217:(e,a,l)=>{l.d(a,{A:()=>t});l(5043);var s=l(579);const t=e=>{let{label:a,name:l,type:t,placeholder:o,value:n,onChange:r,className:i}=e;return(0,s.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,s.jsx)("label",{htmlFor:l,children:a}),(0,s.jsx)("input",{className:"bg-slate-100 px-2 py-1 focus:outline-none border border-slate-300 rounded",type:t,name:l,id:l,placeholder:o,value:n,onChange:r})]})}},5534:(e,a,l)=>{l.r(a),l.d(a,{default:()=>h});var s=l(5043),t=l(8706),o=l(7217),n=l(4091),r=l(3216),i=l(5475);const d=(0,l(7784).A)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);var c=l(7403),p=l(6213),u=l(6328),m=l(579);const h=()=>{const e=(0,r.Zp)(),[a,l]=(0,s.useState)({name:"",email:"",password:"",profilePic:""}),[h,v]=(0,s.useState)(""),x=e=>{const{name:a,value:s}=e.target;l((e=>({...e,[a]:s})))};return(0,m.jsx)("div",{className:"grid place-content-center h-screen",children:(0,m.jsxs)("div",{className:"bg-white w-96 rounded p-5 shadow-md",children:[(0,m.jsx)("div",{className:"w-fit mx-auto mb-2",children:(0,m.jsx)(t.A,{size:80})}),(0,m.jsx)("h3",{children:"Welcome to whatsapp"}),(0,m.jsxs)("form",{onSubmit:async l=>{l.preventDefault(),null===l||void 0===l||l.stopPropagation();try{const l=await p.A.post("https://chat-app-server-euua.onrender.com/api/register",a);var s;if(l.data.success)u.oR.success(null===l||void 0===l||null===(s=l.data)||void 0===s?void 0:s.message),e("/login")}catch(n){var t,o;u.oR.error(null===(t=n.response)||void 0===t||null===(o=t.data)||void 0===o?void 0:o.message)}},className:"grid gap-4 mt-3",children:[(0,m.jsx)(o.A,{label:"Name",name:"name",type:"text",value:null===a||void 0===a?void 0:a.name,placeholder:"Enter the name",onChange:x}),(0,m.jsx)(o.A,{label:"Email",name:"email",type:"email",value:null===a||void 0===a?void 0:a.email,placeholder:"Enter the email",onChange:x}),(0,m.jsx)(o.A,{label:"Password",name:"password",type:"password",value:null===a||void 0===a?void 0:a.password,placeholder:"Enter the password",onChange:x}),(0,m.jsxs)("div",{children:[(0,m.jsxs)("label",{htmlFor:"profilePic",children:["Porfile Picture:",(0,m.jsxs)("div",{className:"h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary",children:[(0,m.jsx)("p",{className:"text-sm mx-w-[300px] text-ellipsis line-clamp-1",children:(null===h||void 0===h?void 0:h.name)||"upload profile photo"}),(null===h||void 0===h?void 0:h.name)&&(0,m.jsx)("button",{className:"text-lg ml-2 hover:text-red-600",onClick:e=>{e.preventDefault(),v(null)},children:(0,m.jsx)(d,{})})]})]}),(0,m.jsx)("input",{type:"file",id:"profilePic",name:"profilePic",className:"bg-slate-100 px-2 py-1 focus:outline-none hidden",onChange:async e=>{var a;const s=null===(a=e.target.files)||void 0===a?void 0:a[0],t=await(0,c.A)(s);v(s),console.log(t,"image"),l((e=>({...e,profilePic:null===t||void 0===t?void 0:t.url})))}})]}),(0,m.jsx)(n.A,{children:"Submit"})]}),(0,m.jsxs)("p",{className:"mt-3 text-center",children:["New User ?"," ",(0,m.jsx)(i.N_,{to:"/register",className:"text-blue-600",children:"Register"})]})]})})}},4091:(e,a,l)=>{l.d(a,{A:()=>t});l(5043);var s=l(579);const t=e=>{let{children:a}=e;return(0,s.jsx)("button",{className:"bg-black w-full text-white rounded-md p-1",children:a})}},7403:(e,a,l)=>{l.d(a,{A:()=>t});const s=`https://api.cloudinary.com/v1_1/${{NODE_ENV:"production",PUBLIC_URL:"/chat-app",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}.REACT_APP_CLOUDINARY_NAME}/auto/upload`,t=async e=>{const a=new FormData;a.append("file",e),a.append("upload_preset","chat-app");const l=await fetch(s,{method:"post",body:a});return await l.json()}}}]);
//# sourceMappingURL=534.248a79f5.chunk.js.map