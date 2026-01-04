/* eslint-disable @typescript-eslint/no-unused-vars */

{/*}
export function AuthenticatePage({isSignIn}: {
    isSignIn: boolean
}) {
    return(
        <div className="w-screen h-screen flex  justify-center items-center">
            <div className="p-2  m-2 bg-white rounded">
                <div className="p-2">
                <input type="text" placeholder="Email"></input>
                </div>
                <div className="p-2">
                <input type="password" placeholder="Password"></input>
                </div>
                <div className="pt-2">
                <button onClick={()=>{

                }}>{isSignIn ? "Signin" : "Signup"}</button> 
                </div>
            </div>

        </div>
    )
}
    */}
    /* eslint-disable @typescript-eslint/no-unused-vars */


export function AuthenticatePage({ isSignIn }: { isSignIn: boolean }) {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
            <div className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {isSignIn ? "Sign In" : "Sign Up"}
                </h1>

                {/* Email */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Button */}
                <button
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300"
                    onClick={() => {
                        // handle submit here
                    }}
                >
                    {isSignIn ? "Sign In" : "Sign Up"}
                </button>

                {/* Switch Link */}
                <p className="text-center mt-4 text-sm text-gray-600">
                    {isSignIn
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    <a
                        href={isSignIn ? "/signup" : "/signin"}
                        className="text-blue-500 hover:underline"
                    >
                        {isSignIn ? "Sign Up" : "Sign In"}
                    </a>
                </p>
            </div>
        </div>
    );
}
