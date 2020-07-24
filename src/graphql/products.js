import gql from "graphql-tag";

// SUB-CATEGORIAS
export const SUBCATEGORY_QUERY = gql`
  query AllSubcategories {
    AllSubcategories {
      _id
      name
    }
  }
`;

export const ADDSUBCATEGORY_MUTATION = gql`
  mutation AddSubcategories($data: OneThingInput!) {
    AddSubcategories(data: $data) {
      _id
      name
    }
  }
`;

export const SUBCATEGORY_DELETE = gql`
  mutation DelSubcategories($subcategoryId: ID!) {
    DelSubcategories(id: $subcategoryId) {
      status
    }
  }
`;

export const UPDATE_SUBCATEGORY = gql`
  mutation UpdateSubcategories($id: ID, $data: OneThingInput) {
    UpdateSubcategories(id: $id, data: $data) {
      _id
      name
    }
  }
`
// SUB-CATEGORIAS

// BRANCHS
export const BRANCH_QUERY = gql`
  query AllBranchs {
    AllBranchs {
      _id
      name
      image
    }
  }
`;

export const ADDBRANCH_MUTATION = gql`
  mutation AddBranch($data: BranchInput) {
    AddBranch(data: $data) {
      _id
      name
      image
    }
  }
`;

export const BRANCH_DELETE = gql`
  mutation DelBranch($branchId: ID!) {
    DelBranch(id: $branchId) {
      status
    }
  }
`;

export const UPDATE_BRANCH = gql`
  mutation UpdateBranch($id: ID, $data: BranchInput) {
    UpdateBranch(id: $id, data: $data) {
      _id
      name
      image
    }
  }
`;
// BRANCHS

// TAGS
export const TAG_QUERY = gql`
  query AllTags {
    AllTags {
      _id
      name
    }
  }
`;

export const ADDTAG_MUTATION = gql`
  mutation AddTag($data: OneThingInput!) {
    AddTag(data: $data) {
      _id
      name
    }
  }
`;

export const TAG_DELETE = gql`
  mutation DelTag($tagId: ID!) {
    DelTag(id: $tagId) {
      status
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation UpdateTag($id: ID, $data: OneThingInput!) {
    UpdateTag(id: $id, data: $data) {
      _id
      name
    }
  }
`;
// TAGS

// GRUPOS TAGS
export const GRUPOTAGS_QUERY = gql`
  query AllTagsgroup {
    AllTagsgroup {
      _id
      name
      tags {
        _id
        name
      }
    }
  }
`;

export const ADDGRUPOSTAG_MUTATION = gql`
  mutation AddTagsgroup($data: TagsgroupInput!) {
    AddTagsgroup(data: $data) {
      _id
      name
      tags {
        _id
        name
      }
    }
  }
`;

export const GRUPOSTAG_DELETE = gql`
  mutation DelTagsgroup($grupostagId: ID!) {
    DelTagsgroup(id: $grupostagId) {
      status
    }
  }
`;

export const GRUPOSTAG_UPDATE = gql`
  mutation UpdateTagsgroup($grupostagId: ID!, $data: TagsgroupInput!) {
    UpdateTagsgroup(id: $grupostagId, data: $data) {
      _id
      name
      tags {
        _id
        name
      }
    }
  }
`;
// GRUPOS TAGS

// CATEGORY
export const CATEGORY_QUERY = gql`
  query AllCategories {
    AllCategories {
      _id
      name
      subcategory {
        _id
        name
      }
      tagsgroup {
        _id
        name
        tags {
          _id
          name
        }
      }
    }
  }
`;

export const ADDCATEGORY_MUTATION = gql`
  mutation AddCategories($data: CategoriesInput!) {
    AddCategories(data: $data) {
      _id
      name
      subcategory {
        _id
        name
      }
      tagsgroup {
        name
        tags {
          _id
          name
        }
      }
    }
  }
`;

export const CATEGORY_DELETE = gql`
  mutation DelCategories($categoryId: ID!) {
    DelCategories(id: $categoryId) {
      status
    }
  }
`;

export const CATEGORY_UPDATE = gql`
  mutation UpdateCategories($categoryId: ID!, $data: CategoriesInput!) {
    UpdateCategories(id: $categoryId, data: $data) {
      _id
      name
      subcategory {
        name
      }
      tagsgroup {
        name
      }
    }
  }
`;
// CATEGORY

// PRODUCTOS
export const PRODUCTOS_QUERY = gql`
  query AllProducts {
    AllProducts {
      _id
      name
      description
      description_long
      price
      highlight
      image
      audio
      branch {
        name
      }
      model
      category {
        _id
        name
        subcategory {
          _id
          name
        }
        tagsgroup{
          _id
          name
          tags {
            _id
            name
          }
        }
      }
      subcategory {
        _id
        name
      }
      tags {
        _id
        name
      }
      ref
      ctd
      important
      createdAt
    }
  }
`;

export const ADDPRODUCT_MUTATION = gql`
  mutation AddProduct($data: ProductInput!) {
    AddProduct(data: $data) {
      _id
      name
      description
      description_long
      price
      highlight
      image
      audio
      branch {
        name
      }
      model
      category {
        name
      }
      subcategory {
        name
      }
      tags {
        name
      }
      ref
      ctd
      important
      createdAt
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DelProduct($productId: ID!) {
    DelProduct(id: $productId) {
      status
    }
  }
`;

export const PRODUCT_UPDATE = gql`
  mutation UpdateProduct($productId: ID!, $data: ProductInput!) {
    UpdateProduct(id: $productId, data: $data) {
      _id
      name
      description
      description_long
      price
      branch {
        name
      }
      model
      category {
        name
      }
      subcategory {
        name
      }
      tags {
        name
      }
      ref
      ctd
      important
      createdAt
    }
  }
`;
// PRODUCTOS
