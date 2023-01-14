import React, { useEffect, useState } from "react";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Auth, Hub } from "aws-amplify";
import LoadingSpinner from "../components/LoadingSpinner";

export const AuthContext = React.createContext({
    user: null,
    unverifiedAccount: {
        email: null,
        password: null,
    },
    userLoading: true,
    signIn: async (p: { password: string; email: string }) => Promise,
    signOut: async () => Promise,
    signUp: async (p: { firstName: string; lastName: string; password: string; email: string }) => Promise,
    confirmAccount: async (p: { confirmCode: string }) => Promise,
    sendPasswordResetMail: async () => Promise,
    resendConfirmCode: () => {},
    signInWithGoogle: async (event: any) => Promise,
    signInWithFacebook: async (event: any) => Promise,
});

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [unverifiedAccount, setUnverifiedAccount] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        fetchAuthUser();
        // listening for auth change events
        setupAuthSubscription();
        return () => {
            Hub.remove("auth", fetchAuthUser);
        };
    }, []);

    /**
     * fetch currently logged-in user using AWS Auth library
     * @returns {Promise<void>}
     */
    const fetchAuthUser = async () => {
        try {
            console.log("fetchAuthUser");
            const fetchedUser = await Auth.currentAuthenticatedUser();
            setUserLoading(false);
            setUser(fetchedUser);
        } catch (err) {
            setUserLoading(false);
            setUser(null);
        }
    };

    /**
     * subscription for auth event changes
     */
    const setupAuthSubscription = () => {
        Hub.listen('auth', async ({ payload: { event, data } }) => {
            console.log('Auth Status Changed Event: ', event);
            console.log('Auth Status Changed Data: ', data);
            switch (event) {
                case 'signIn':
                    await fetchAuthUser();
                    break;
                case 'signOut':
                    setUser(null);
                    break;
                case 'signIn_failure':
                case 'signUp_failure':
                    if (user) {
                        setUser(null);
                    }
                    break;
                case 'signUp':
                case 'forgotPassword':
                case 'forgotPasswordSubmit':
                case 'forgotPasswordSubmit_failure':
                case 'forgotPassword_failure':
                    break;
                default:
                    await fetchAuthUser();
            }
        });
    };

    /**
     * log user in
     * @param email
     * @param password
     */
    const signIn = async ({ email, password }: {email: string, password: string}) => {
        await Auth.signIn({username: email, password});
    };

    /**
     * create new user account
     * @param email
     * @param password
     * @param firstName
     * @param lastName
     */
    const signUp = async ({ email, password, firstName, lastName }: {email: string, password: string, firstName: string, lastName: string}) => {
        await Auth.signUp({
            username: email,
            password,
            attributes: {
                email,
                name: `${firstName} ${lastName}`,
            }
        });
        setUnverifiedAccount({ email, password });
    };

    /**
     * confirm account using code
     * @param confirmCode
     * @returns {Promise<any>}
     */
    const confirmAccount = async ({ confirmCode }: {confirmCode: string}) => {
        await Auth.confirmSignUp(unverifiedAccount?.email, confirmCode);
        await signIn({
            email: unverifiedAccount?.email,
            password: unverifiedAccount?.password,
        });
    };

    /**
     * resend confirmation code
     * @returns {Promise<any>}
     */
    const resendConfirmCode = async () => Auth.resendSignUp(unverifiedAccount?.email);

    /**
     * logout user
     */
    const signOut = async () => Auth.signOut();

    /**
     * send forgot password confirmation code to email
     * @param email
     * @returns {Promise<any>}
     */
    const sendPasswordResetMail = async ({ email }: {email: string}) => Auth.forgotPassword(email);

    const signInWithGoogle = async (event: any) => {
        event?.preventDefault();
        try {
            await Auth.federatedSignIn({
                provider: CognitoHostedUIIdentityProvider.Google,
            });
        } catch (err) {
            console.error("Auth Error: ", err);
        }
    }

    const signInWithFacebook = async (event: any) => {
        event?.preventDefault();
        try {
            await Auth.federatedSignIn({
                provider: CognitoHostedUIIdentityProvider.Facebook,
            });
        } catch (err) {
            console.error("Auth Error: ", err);
        }
    }

    const value: any = {
        user,
        unverifiedAccount,
        userLoading,
        signIn,
        signOut,
        signUp,
        confirmAccount,
        sendPasswordResetMail,
        resendConfirmCode,
        signInWithGoogle,
        signInWithFacebook,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;