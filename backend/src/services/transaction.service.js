import mongoose from "mongoose";

const withTransactionService = async (serviceFunction) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await serviceFunction(session);

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export default withTransactionService;
