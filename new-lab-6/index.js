const { ApolloServer, gql } = require('apollo-server');
const lodash = require('lodash');
const uuid = require('uuid');
//some Mock data
let images = [
  {
    id: 'm5TxEgWPz78',
    url: "https://images.unsplash.com/photo-1619538189526-4189d72a9e08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjYzODl8MXwxfGFsbHwxMXx8fHx8fDJ8fDE2MjAwMTU0MTE&ixlib=rb-1.2.1&q=80&w=1080",
    posterName: 'ballparkbrand',
    description: "hotdog sandwich with sauce on brown wooden table",
    userPosted: false,
    binned: false
  },
  {
    id: 'VT3570ldxbQ',
    url: "https://images.unsplash.com/photo-1619955617520-8dc17e989d79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjYzODl8MHwxfGFsbHwxMnx8fHx8fDJ8fDE2MjAwMTU0MTE&ixlib=rb-1.2.1&q=80&w=1080",
    posterName: 'siri_louis',
    description: " Camera women  Model Shot led light",
    userPosted: false,
    binned: false
  },
  {
    id: 'alEUOL4fGcc',
    url: "https://images.unsplash.com/photo-1619785273342-1f22da3026d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjYzODl8MHwxfGFsbHwxM3x8fHx8fDJ8fDE2MjAwMTU0MTE&ixlib=rb-1.2.1&q=80&w=1080",
    posterName: 'mikecrawatphotography',
    description: "A pink E30 M3 in the forest.\n\nmikecrawatpresets.com",
    userPosted: false,
    binned: false
  },
  {
    id: 'x5hyhMBjR3M',
    url: "https://images.unsplash.com/photo-1619968987472-4d1b2784592e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjYzODl8MHwxfGFsbHwxNHx8fHx8fDJ8fDE2MjAwMTU0MTE&ixlib=rb-1.2.1&q=80&w=1080",
    posterName: 'contentpixie',
    description: "Girl holding an abalone shell, and a pine smudge stick during a smudging holistic ritual.",
    userPosted: false,
    binned: false
  },
  {
    id: 'vagr_XT9Cms',
    url: "https://images.unsplash.com/photo-1619785292559-a15caa28bde6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjYzODl8MHwxfGFsbHwxNXx8fHx8fDJ8fDE2MjAwMTU0MTE&ixlib=rb-1.2.1&q=80&w=1080",
    posterName: 'shinfe',
    description: "woman in purple blazer sitting on brown wooden bench during daytime",
    userPosted: false,
    binned: false
  }
];

let employers = [
  {
    id: 1,
    name: 'Stevens Institute of Technology'
  },
  {
    id: 2,
    name: 'Google'
  },
  {
    id: 3,
    name: 'Apple'
  }
];

//Create the type definitions for the query and our data
const typeDefs = gql`
  type Query {
    unsplashImages:[ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }

  type Employer {
    id: Int
    name: String
    employees: [Employee]
    numOfEmployees: Int
  }

  type ImagePost {
    id: ID
    url: String
    posterName: String
    description: String
    userPosted: Boolean
    binned: Boolean
}

  type Mutation {
    uploadImage(url: String!, description: String, posterName: String): ImagePost
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean) : ImagePost
    deleteImage(id: ID!) : ImagePost
  }
`;

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

const resolvers = {
  Query: {
    employer: (_, args) => employers.filter((e) => e.id === args.id)[0],
    employee: (_, args) => employees.filter((e) => e.id === args.id)[0],
    employers: () => employers,
    employees: () => employees
  },
  Employer: {
    numOfEmployees: (parentValue) => {
      console.log(`parentValue in Employer`, parentValue);
      return employees.filter((e) => e.employerId === parentValue.id).length;
    },
    employees: (parentValue) => {
      return employees.filter((e) => e.employerId === parentValue.id);
    }
  },
  Employee: {
    employer: (parentValue) => {
      //console.log(`parentValue in Employee`, parentValue);
      return employers.filter((e) => e.id === parentValue.employerId)[0];
    }
  },
  Mutation: {
    addEmployee: (_, args) => {
      const newEmployee = {
        id: uuid.v4(),
        firstName: args.firstName,
        lastName: args.lastName,
        employerId: args.employerId
      };
      employees.push(newEmployee);
      return newEmployee;
    },
    removeEmployee: (_, args) => {
      return lodash.remove(employees, (e) => e.id == args.id)[0];
    },
    editEmployee: (_, args) => {
      let newEmployee;
      employees = employees.map((e) => {
        if (e.id === args.id) {
          if (args.firstName) {
            e.firstName = args.firstName;
          }
          if (args.lastName) {
            e.lastName = args.lastName;
          }
          if (args.employerId) {
            e.employerId = args.employerId;
          }
          newEmployee = e;
          return e;
        }
        return e;
      });
      return newEmployee;
    },
    addEmployer: (_, args) => {
      const newEmployer = {
        id: employers.length + 1,
        name: args.name
      };
      employers.push(newEmployer);
      return newEmployer;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
