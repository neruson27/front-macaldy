import gql from "graphql-tag";

/* 
AllSlide: [Slide]
AddSlide(data: SlideInput): Slide
DelSlide(id: ID): Response
*/

export const ALL_SLIDE_QUERY = gql`
  query AllSlide {
    AllSlide {
      _id
      image
    }
  }
`;

export const SLIDE_ADD = gql`
  mutation AddSlide($data: SlideInput) {
    AddSlide(data: $data) {
      _id
      image
    }
  }
`;

export const SLIDE_DELETE = gql`
  mutation DelSlide($id: ID!) {
    DelSlide(id: $id) {
      status
    }
  }
`;