
const Client = require('../models/Client');
const Project = require('../models/Project');


const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');

// client type

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        address: { type: GraphQLString }
    })
});
// project type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        clientId: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, args) {
                return Client.findById(args.id);
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parentValue, args) {
                return Client.find({});
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parentValue, args) {
                return Project.findById(args.id);
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parentValue, args) {
                return Project.find({});
            }
        }
    }
});


//Mutations

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
                address: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                    address: args.address
                });
                return client.save();
            }

        },
        // delete a client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parentValue, args) {
                return Client.findByIdAndRemove(args.id);
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            "new": { value: "Not Started" },
                            "progress": { value: "In Progress" },
                            "completed": { value: "Completed" }
                        },
                    }),
                    defaultValue: "Not Started"
                },
                clientId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                });
                return project.save();
            }
        },
        //delete a project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parentValue, args) {
                return Project.findByIdAndRemove(args.id);
            }
        },
        // update a project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatusUpdate",
                        values: {
                            "new": { value: "Not Started" },
                            "progress": { value: "In Progress" },
                            "completed": { value: "Completed" }
                        },
                    }),
                },
                clientId: { type: GraphQLID }
            },
            resolve(parentValue, args) {
                return Project.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status,
                        clientId: args.clientId
                    }
                }, { new: true });
            },
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});

