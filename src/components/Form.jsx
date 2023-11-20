import { useFormik } from "formik";
import PropTypes from "prop-types";
import { BsFillSendArrowDownFill } from "react-icons/bs";
import { loading } from "../signals";
const Form = ({ submitData }) => {
  const formData = useFormik({
    initialValues: {
      inputQuery: "",
    },
    onSubmit: () => {
      submitData(formData.values);
      formData.resetForm();
    },
    validate: (values) => {
      const errors = {};
      if (!values.inputQuery) {
        errors.inputQuery = "Message cannot be empty";
      }
      return errors;
    },
  });

  return (
    <form onSubmit={formData.handleSubmit}>
      <div className="relative w-full">
        <input
          type="text"
          name="inputQuery"
          placeholder="Where do you want to go?"
          onChange={(e) => formData.handleChange(e)}
          value={formData.values.inputQuery}
          className="border-b-2 border-black p-2 w-full outline-none bg-transparent"
          aria-autocomplete="none"
          autoComplete="off"
          disabled={loading.value}
        />
        <button
          type="submit"
          className="bg-transparent text-black rounded-lg px-2 py-1 absolute right-0 top-1/2 transform -translate-y-1/2 outline-none"
        >
          <BsFillSendArrowDownFill />
        </button>
        {
          <p className="text-red-500">
            {formData.touched.inputQuery && formData.errors.inputQuery}
          </p>
        }
      </div>
    </form>
  );
};

export default Form;

Form.propTypes = {
  submitData: PropTypes.func.isRequired,
};
