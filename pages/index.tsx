import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Button,
  CircularProgress
} from "@material-ui/core";
import { Formik, Form } from "formik";

import useStyles from "./styles";

interface HomeProps {
  data: any;
}

export async function getServerSideProps() {
  const res = await fetch(`https://ulventech-react-exam.netlify.app/api/form`);
  const data = await res.json();

  return { props: { data } };
}

interface FormFieldType {
  type: string;
  defaultValue: string;
  value: string;
  fieldName: string;
  options?: Array<string>;
}

const Home = (props: HomeProps) => {
  var classes = useStyles();
  const [formData, setFormData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const { data } = props;
    if (data.success === true) {
      let form = Object.create({});
      for(let item of data.data) {
        form[item.fieldName] = item.value;
      }
      setFormData(data.data);
      setInitialData(form);
    }
  }, []);

  return (
    <Container maxWidth="sm" className={classes.body}>
      <Typography variant="h5">Dynamic form</Typography>
      <Box className={classes.form}>
        <Formik
          // validationSchema={schema}
          onSubmit={(values) => {
            setIsLoading(true);
            fetch(`api/form`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(values)
            })
            .then(res => res.json())
            .then(res => {
              setResponse(res);
              setIsLoading(false);
            })
            .catch(error => {
              console.log(error);
              setIsLoading(false);
            });
          }}
          initialValues={initialData}
          enableReinitialize
        >
          {({
            handleChange,
            handleBlur,
            values,
          }) => (
            <Form>
              <Grid container spacing={2}>
                {formData.map((formField: FormFieldType) => (
                  <Grid item xs={12} key={formField.fieldName}>
                    <FormField
                      type={formField.type}
                      value={(values as any)[formField.fieldName]}
                      fieldName={formField.fieldName}
                      disabled={isLoading}
                      options={formField.options}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} className={classes.btnContainer}>
                  <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                    {isLoading && (
                      <CircularProgress
                        size="14px"
                        className={classes.progress}
                      />
                    )}
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        { !isLoading && response && (
          <Box>
            <Typography variant="h5">Response</Typography>
            <Typography variant="body2">{JSON.stringify(response)}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

interface FormFieldProps {
  type: string;
  value: string;
  fieldName: string;
  disabled: boolean;
  options?: Array<string>;
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
}

const FormField = (props: FormFieldProps) => {
  const inputTypes = ['text', 'email', 'number'];
  const { type, value, fieldName, disabled, handleChange, handleBlur } = props;
  if(inputTypes.indexOf(type) !== -1)
    return (
      <TextField
        placeholder="Type Name"
        fullWidth
        name={fieldName}
        value={value}
        type={type}
        onChange={handleChange}
        onBlur={handleBlur}
        label={fieldName}
        variant="outlined"
        disabled={disabled}
      />
    );
  else if(type === 'multiline')
    return (
      <TextField
        placeholder="Type Name"
        fullWidth
        name={fieldName}
        value={value}
        type={type}
        onChange={handleChange}
        onBlur={handleBlur}
        label={fieldName}
        variant="outlined"
        multiline={true}
        disabled={disabled}
      />
    );
  else if(type === 'select' && props.options && value)
    return (
      <TextField
        fullWidth
        select
        name={fieldName}
        value={value}
        type={type}
        onChange={handleChange}
        onBlur={handleBlur}
        label={fieldName}
        variant="outlined"
        disabled={disabled}
      >
        {
          props.options.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))
        }
      </TextField>
    )
  return null;
};

export default Home;
