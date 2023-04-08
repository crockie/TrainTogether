import * as Yup from "yup";
import { Formik } from "formik";
import {useLocation, useNavigate} from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import background from "../../../assets/css/Background.module.css";
import padding from "../../../assets/css/Padding.module.css";
import formStyle from "../../../assets/css/Form.module.css";
import buttonStyle from "../../../assets/css/Button.module.css";

import { CreateUser, GetSize } from "../../../provider/firestore/FirestoreProvider";
import {calculateAge} from "../../../misc/dateConverter";

export default function SetupWrapper() {
  return (
    <div className={`${background.login} d-flex`}>
      <Container className={padding.heading}>
        <div className={formStyle.setup}>
          <Setup></Setup>
        </div>
      </Container>
    </div>
  );
}

function Setup() {
    const navigate = useNavigate();
    const { state } = useLocation();
  const schema = Yup.object().shape({
    age: Yup.date()
      .min(new Date(1900, 0, 1), "You cannot choose a date before this!")
      .max(
        new Date(new Date().getFullYear() - 10, 1),
        "You cannot be younger than 10 years old!"
      )
      .required("Required"),
    height: Yup.number()
      .min(90, "Must be at least 90 cm")
      .max(220, "Cannot be more than 220 cm")
      .required("Please enter your height in cm"),
    weight: Yup.number()
      .min(20, "Must be at least 20 kg")
      .max(400, "Cannot be more than 400 kg")
      .required("Please enter your weight in kg"),
      mobile: Yup
          .string()
          .matches(/(6|8|9)\d{7}/, "Phone number is not valid"),
    gender: Yup.string().required("Required"),
    image: Yup.string().nullable(),
  });
  return (
    <Formik
      validationSchema={schema}
      onSubmit={async (values) => {
          try {
              const age = calculateAge(values.age);
              const userDetails = state.user;
              const email = userDetails.email;
              const gender = values.gender;
              const height = values.height;
              const mobile = values.mobile;
              const name = userDetails.name;
              const image = values.image;
              const id = await GetSize("User") + 1;
              const username = userDetails.username;
              const weight = values.weight;
              const data = {
                  age,
                  email,
                  gender,
                  height,
                  mobile,
                  name,
                  image,
                  id,
                  username,
                  weight,
              }
              const status = await CreateUser(id,{data});
              if (status)
                  navigate("../../profile");
          } catch(err) {
              console.log(err);

          }
      }}
      initialValues={{
        age: new Date(),
        height: 100,
        weight: 30.5,
        gender: "Male",
        image: "",
          mobile: "91248592"
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form onSubmit={handleSubmit} className="text-light ms-3 ms-sm-2">
          <Form.Group className="mb-3" controlId="ageInput">
            <FloatingLabel className="text-dark" label="Date of Birth">
              <Form.Control
                name="age"
                type="date"
                placeholder="age"
                value={values.age}
                onChange={handleChange}
                isInvalid={!!errors.age && touched.age}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors?.age}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Form.Group>
            <Form.Group className="mb-3" controlId="mobileInput">
                <FloatingLabel className="text-dark" label="Phone Number">
                    <Form.Control
                        type="text"
                        name="mobile"
                        value={values.mobile}
                        onChange={handleChange}
                        isInvalid={!!errors.mobile && touched.mobile}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                        {errors?.mobile}
                    </Form.Control.Feedback>
                </FloatingLabel>
            </Form.Group>
          <Row>
            <Form.Group as={Col} className="mb-3" controlId="heightInput">
              <FloatingLabel className="text-dark" label="Height (cm)">
                <Form.Control
                  name="height"
                  type="number"
                  placeholder="Height"
                  value={values.height}
                  onChange={handleChange}
                  isInvalid={!!errors.height && touched.height}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors?.height}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="weightInput">
              <FloatingLabel className="text-dark" label="Weight (kg)">
                <Form.Control
                  name="weight"
                  type="number"
                  placeholder="Weight"
                  value={values.weight}
                  onChange={handleChange}
                  isInvalid={!!errors.weight && touched.weight}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors?.weight}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="genderInput">
              <FloatingLabel label="Gender" className="text-dark">
                <Form.Select
                  name="gender"
                  placeholder="Gender"
                  value={values.gender}
                  onChange={handleChange}
                  isInvalid={!!errors.gender && touched.gender}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors?.gender}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="imageInput">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              accept="image/png, image/jpg, image/gif"
              name="image"
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-center text-muted"></div>
          <div className="d-grid gap-2 pt-2 mt-2">
            <Button className={buttonStyle.setup} type="submit">
              <h3>Complete Setup</h3>
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
