import mongoose from 'mongoose';
import Class from '../lib/models/Class';
import AdmissionQuery from '../lib/models/AdmissionQuery';
import Test from '../lib/models/Test';
import { connectDB } from '../lib/db';

async function testLogic() {
  await connectDB();
  console.log('Connected to DB');

  // 1. Create a Test Class
  const testClass = await Class.create({
    name: 'Test Class 101',
    fees: 5000,
    admissionFee: 2500,
    description: 'Testing admission fee logic',
    isActive: true
  });
  console.log('Created Class:', testClass.name, 'with Admission Fee:', testClass.admissionFee);

  // 2. Create a dummy Test
  const dummyTest = await Test.create({
    title: 'Admission Test',
    class: testClass._id,
    totalMarks: 100,
    passingMarks: 50,
    mcqs: [{ question: '1+1?', options: ['1','2'], correctAnswer: 1, marks: 100 }]
  });

  // 3. Create a dummy Admission Query
  const admission = await AdmissionQuery.create({
    name: 'Test Student',
    class: 'Test Class 101',
    shift: 'Morning',
    contact1: '123456789'
  });

  // 4. Simulate Submission (passed)
  const classInfo = await Class.findById(dummyTest.class);
  const classFees = classInfo?.fees || 0;
  const admissionFee = classInfo?.admissionFee || 0;
  const totalFee = classFees + admissionFee;

  const voucherData = {
    studentName: admission.name,
    classFees,
    admissionFee,
    totalFee,
    fees: [
      { month: 'Current', particular: 'Tuition Fee', amount: classFees },
      { month: 'Current', particular: 'Admission Fee', amount: admissionFee },
    ]
  };

  console.log('--- TEST RESULT ---');
  console.log('Voucher Tuition Fee:', voucherData.fees[0].amount);
  console.log('Voucher Admission Fee:', voucherData.fees[1].amount);
  console.log('Total Fee:', voucherData.totalFee);

  if (voucherData.fees[1].amount === 2500) {
    console.log('SUCCESS: Admission Fee correctly fetched from Class DB!');
  } else {
    console.log('FAILURE: Admission Fee mismatch!');
  }

  // Cleanup
  await Class.findByIdAndDelete(testClass._id);
  await Test.findByIdAndDelete(dummyTest._id);
  await AdmissionQuery.findByIdAndDelete(admission._id);
  process.exit(0);
}

testLogic().catch(err => {
  console.error(err);
  process.exit(1);
});
