import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import * as Yup from "yup";
import { Formik } from "formik";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "../components/CopyRight";
import FacebookIcon from "@mui/icons-material/Facebook";
import googleImage from "../assets/images/google.png";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SignUp() {
  const navigate = useNavigate();
  const [confirmMode, setConfirmMode] = React.useState(false);
  const {
    signUp,
    isAuthenticated,
    isAuthenticating,
    unverifiedAccount,
    confirmAccount,
  } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    password: Yup.string()
      .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
  });

  //
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated]);

  if (isAuthenticating || isAuthenticated) {
    return <LoadingSpinner />;
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {!confirmMode ? (
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              submit: null,
            }}
            validationSchema={validationSchema}
            onSubmit={async (
              values: any,
              { setErrors, setStatus, setSubmitting }: any
            ): Promise<void> => {
              try {
                setSubmitting(true);
                // sign up user
                await signUp({
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  password: values.password,
                });
                setConfirmMode(true);
                setSubmitting(false);
              } catch (err: any) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }): JSX.Element => (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      value={values?.firstName}
                      onChange={handleChange}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      value={values?.lastName}
                      onChange={handleChange}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      value={values?.email}
                      onChange={handleChange}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      value={values?.password}
                      onChange={handleChange}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>
                {/*Display Error with Icon*/}
                {errors?.submit && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ErrorOutlineIcon sx={{ color: "red", mr: 1 }} />
                    <Typography variant="body2" color="error">
                      {errors?.submit}
                    </Typography>
                  </Box>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Formik>
        ) : (
          <>
            <Divider sx={{ my: 2 }} />
            {/*Confirmation Code */}
            <Formik
              initialValues={{
                code: "",
                submit: null,
              }}
              validationSchema={Yup.object({
                code: Yup.string()
                  .min(6, "Confirmation Code should contain 6 characters")
                  .required("Code is required"),
              })}
              onSubmit={async (
                values: any,
                { setErrors, setStatus, setSubmitting }: any
              ): Promise<void> => {
                try {
                  setSubmitting(true);
                  // confirm sign up user
                  await confirmAccount({ code: values.code });
                  setSubmitting(false);
                  // navigate to dashboard
                  navigate("/", { replace: true });
                } catch (err: any) {
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }}
            >
              {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
              }): JSX.Element => (
                <Grid
                  component="form"
                  onSubmit={handleSubmit}
                  container
                  spacing={2}
                >
                  <Grid
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    item
                    xs={12}
                  >
                    <CheckCircleOutlineIcon sx={{ color: "green", mr: 1 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      We have sent a confirmation code to your email address{" "}
                      <b>({unverifiedAccount?.email})</b>. Please enter the code
                      below to complete sign up.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="code"
                      label="Confirmation Code"
                      value={values?.code}
                      onChange={handleChange}
                      error={Boolean(touched.code && errors.code)}
                      helperText={touched.code && errors.code}
                      type="text"
                      id="code"
                      autoComplete="confirmationCode"
                    />
                    {/*Display Error with Icon*/}
                    {errors?.submit && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ErrorOutlineIcon sx={{ color: "red", mr: 1 }} />
                        <Typography variant="body2" color="error">
                          {errors?.submit}
                        </Typography>
                      </Box>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Confirm Sign Up
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Formik>
          </>
        )}
        <Typography
          sx={{
            width: "100%",
            my: 2,
            textAlign: "center",
          }}
        >
          OR
        </Typography>
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "black",
            my: 2,
            ":hover": {
              backgroundColor: "whitesmoke",
            },
          }}
          startIcon={
            <Avatar src={googleImage} sx={{ width: 20, height: 20 }} />
          }
        >
          Sign Up with Google
        </Button>
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#1877F2",
            my: 2,
            ":hover": {
              backgroundColor: "#166FE5",
            },
          }}
          startIcon={<FacebookIcon fontSize="large" />}
        >
          Sign Up with Facebook
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/signin" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
