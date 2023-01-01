import LocalizedStrings, { LocalizedStringsMethods } from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
  nedaaPrivacyPolicy: string;
  nedaaPrivacyPolicyContent: string;
  logFiles: string;
  logFilesContent: string;
  consent: string;
  consentContent: string;
  contactUs: string;
  contactUsContent: string;
  policyEffectiveDate: string;
}

let strings: IStrings;
strings = new LocalizedStrings({
  en: {
    nedaaPrivacyPolicy: "Nedaa Privacy Policy",
    nedaaPrivacyPolicyContent: `At Nedaa, one of our main priorities is the privacy of our
        visitors. This Privacy Policy document contains types of
        information that is collected and recorded by Nedaa and how we use
        it.`,
    logFiles: `Log Files`,
    logFilesContent: `Nedaa follows a standard procedure of using log files. These files
    log visitors when they use app. The information collected by log
    files include the date and time stamp of access, the country that
    is used to fetch the prayer times, and also any errors and crashes
    that happen on the app, which helps us analyze bugs and fix them
    for future releases. The data collected are not linked to any
    information that is personally identifiable. The purpose of the
    information is for analyzing trends, administering the app, and
    help fix future issues.`,
    consent: `Consent`,
    consentContent: `By using our app, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.`,
    contactUs: `Contact Us`,
    contactUsContent: `If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at`,
    policyEffectiveDate: `This policy is effective as of 2023-01-01`,
  },
  ar: {
    nedaaPrivacyPolicy: "سياسة الخصوصية لنداء",
    nedaaPrivacyPolicyContent: `في نداء، واحدة من أولوياتنا الرئيسية هي خصوصية المستخدمين. تحتوي وثيقة سياسة الخصوصية هذه على أنواع المعلومات التي تجمعها وتسجلها نداء وكيفية استخدامها.`,
    logFiles: `ملفات السجل`,
    logFilesContent: `تتبع نداء إجراء عادي لاستخدام ملفات السجل. تسجل هذه الملفات الزوار عند استخدامهم للتطبيق. تتضمن المعلومات التي تجمعها ملفات السجل التاريخ ووقت الاستخدام والبلد المستخدم لجلب مواقيت الصلاة، وكذلك أي أخطاء وأعطال تحدث على التطبيق، مما يساعدنا على تحليل الأخطاء وإصلاحها للإصدارات المستقبلية. البيانات التي يتم جمعها غير مرتبطة بأي معلومات يمكن التعرف عليها شخصيا. الغرض من المعلومات هو تحليل المشاكل وإدارة التطبيق والمساعدة في حل المشكلات المستقبلية.`,
    consent: `موافقة`,
    consentContent: `باستخدام تطبيقنا، فإنك توافق بموجب هذا على سياسة الخصوصية الخاصة بنا وتوافق على الشروط والأحكام الخاصة بها.`,
    contactUs: `تواصل معنا`,
    contactUsContent: `إذا كان لديك أي أسئلة أو اقتراحات حول سياسة الخصوصية الخاصة بنا، فلا تتردد في الاتصال بنا على`,
    policyEffectiveDate: `تسري هذه السياسة اعتبارا من 2023-01-01`,
  },
});

export default strings;
