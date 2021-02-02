
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

export default class MongoStore {
    constructor() {
        this.init = this.init();
    }
    async init() {
        const username = encodeURIComponent(process.env.MONGO_INITDB_ROOT_USERNAME);
        const password = encodeURIComponent(process.env.MONGO_INITDB_ROOT_PASSWORD);
        const clusterUrl = "127.0.0.1";
        const uri = `mongodb://${username}:${password}@${clusterUrl}/?authMechanism=DEFAULT`;
        this.client = new MongoClient(uri);
        await this.client.connect();
        this.db = this.client.db("nextit");
        this.collection = this.db.collection("pull_requests");
    }
    async closePullRequest(pullRequest) {
        await this.init;
        await this.collection.insertOne(pullRequest);
    }
    async getPullRequests() {
        await this.init;
        const cursor = this.collection.find();
        return (await cursor.toArray()).map(({ _id, ...rest }) => rest);
    }

    async getUploadEvidenceStream(id) {
        await this.init;
        const bucket = new GridFSBucket(this.db, { bucketName: 'evidence' });
        return bucket.openUploadStream(id);
    }

    async getDownloadEvidenceStream(id) {
        await this.init;
        const bucket = new GridFSBucket(this.db, { bucketName: 'evidence' });
        const stream = bucket.openDownloadStreamByName(id);
        return stream;
    }
}
