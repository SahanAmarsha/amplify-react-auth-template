import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "../components/CopyRight";
import googleImage from "../assets/images/google.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, isAuthenticating } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
  });

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
          Sign in
        </Typography>
        <Formik
          initialValues={{
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
              // user sign in
              await signIn({email: values.email, password: values.password});
              navigate("/", { replace: true });
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
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Grid container spacing={2}>
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
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                </Grid>
              </Grid>
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
                Sign In with Google
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
                Sign In with Facebook
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          )}
        </Formik>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
