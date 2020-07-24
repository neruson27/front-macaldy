import gql from "graphql-tag";

// registrar usuario
export const REGISTRAR_MUTATION = gql`
  mutation SignUpAdmin($data: SignUpAdmin) {
    SignUp(data: $data) {
      admin {
        id
        fullName
        email
      }
      message
    }
  }
`;

export const LOGIN_QUERY = gql`
  query Auth($data: Auth) {
    Login(data: $data) {
      token {
        code
        expire
      }
      admin {
        id
        email
        lastConection
      }
    }
  }
`;

export const ADMIN_EXIST_QUERY = gql`
  query AdminExist {
    AdminExist
  }
`