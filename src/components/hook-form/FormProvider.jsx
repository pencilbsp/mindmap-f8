import { FormProvider as Form } from "react-hook-form"

// ----------------------------------------------------------------------

export default function FormProvider({ id, children, onSubmit, methods, className }) {
  return (
    <Form {...methods}>
      <form className={className} id={id} onSubmit={onSubmit}>
        {children}
      </form>
    </Form>
  )
}
