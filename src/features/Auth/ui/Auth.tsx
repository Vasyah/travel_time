// import supabase from '@/shared/config/supabase'
// import Script from 'next/script'
//
// export default function GoogleLoginButton() {
//   async function handleSignInWithGoogle(response) {
//     const { data, error } = await supabase.auth.signInWithIdToken({
//       provider: 'google',
//       token: response.credential,
//     })
//   }
//
//   return (
//     <>
//       <Script src="https://accounts.google.com/gsi/client" />
//       <div
//         id="g_id_onload"
//         data-client_id="<client ID>"
//         data-context="signin"
//         data-ux_mode="popup"
//         data-callback="handleSignInWithGoogle"
//         data-nonce=""
//         data-auto_select="true"
//         data-itp_support="true"
//         data-use_fedcm_for_prompt="true"
//       ></div>
//       <div
//         className="g_id_signin"
//         data-type="standard"
//         data-shape="pill"
//         data-theme="outline"
//         data-text="signin_with"
//         data-size="large"
//         data-logo_alignment="left"
//       ></div>
//       <button onClick={handleSignInWithGoogle}>Login with Google</button>
//     </>
//   )
// }
