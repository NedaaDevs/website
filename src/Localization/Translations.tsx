import LocalizedStrings, { LocalizedStringsMethods } from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
  nedaaPrivacyPolicy: string;
  nedaaPrivacyPolicyContent: string;
  logFiles: string;
  logFilesContent: string;
  thirdPartyPrivacyPolicies: string;
  thirdPartyPrivacyPoliciesContent: string;
  childrensInformation: string;
  childrensInformationContentOne: string;
  childrensInformationContentTwo: string;
  onlinePrivacyPolicyOnly: string;
  onlinePrivacyPolicyOnlyContent: string;
  onlinePrivacyPolicyOnlyContentLinkHref: string;
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
    thirdPartyPrivacyPolicies: `Third Party Privacy Policies`,
    thirdPartyPrivacyPoliciesContent: `Nedaa's Privacy Policy does not apply to other advertisers or
    websites. Thus, we are advising you to consult the respective
    Privacy Policies of these third-party ad servers for more detailed
    information. It may include their practices and instructions about
    how to opt-out of certain options.`,
    childrensInformation: `Children's Information`,
    childrensInformationContentOne: `Another part of our priority is adding protection for children
    while using the internet. We encourage parents and guardians to
    observe, participate in, and/or monitor and guide their online
    activity.`,
    childrensInformationContentTwo: `Nedaa does not knowingly collect any Personal Identifiable
    Information from children under the age of 13. If you think that
    your child provided this kind of information on our App, we
    strongly encourage you to contact us immediately and we will do
    our best efforts to promptly remove such information from our
    records.`,
    onlinePrivacyPolicyOnly: `Online Privacy Policy Only`,
    onlinePrivacyPolicyOnlyContent: `This Privacy Policy applies only to our online activities and is
    valid for visitors to our App with regards to the information that
    they shared and/or collect in Nedaa. This policy is not applicable
    to any information collected offline or via channels other than
    this app. Our Privacy Policy was created with the help of the`,
    onlinePrivacyPolicyOnlyContentLinkHref: `App Privacy Policy Generator from App-Privacy-Policy.com`,
    consent: `Consent`,
    consentContent: `By using our app, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.`,
    contactUs: `Contact Us`,
    contactUsContent: `If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at`,
    policyEffectiveDate: `This policy is effective as of 2023-01-01`,
  },
  ar: {
    nedaaPrivacyPolicy: "سياسة الخصوصية لنداء",
    nedaaPrivacyPolicyContent: `في نداء، واحدة من أولوياتنا الرئيسية هي خصوصية زوارنا. تحتوي وثيقة سياسة الخصوصية هذه على أنواع المعلومات التي تجمعها وتسجلها نداء وكيفية استخدامها.`,
    logFiles: `ملفات السجل`,
    logFilesContent: `تتبع نداء إجراء قياسيا لاستخدام ملفات السجل. تسجل هذه الملفات الزوار عند استخدامهم للتطبيق. تتضمن المعلومات التي تجمعها ملفات السجل طابع التاريخ والوقت للوصول، والبلد المستخدم لجلب مواقيت الصلاة، وكذلك أي أخطاء وأعطال تحدث على التطبيق، مما يساعدنا على تحليل الأخطاء وإصلاحها للإصدارات المستقبلية. البيانات التي يتم جمعها غير مرتبطة بأي معلومات يمكن التعرف عليها شخصيا. الغرض من المعلومات هو تحليل الاتجاهات وإدارة التطبيق والمساعدة في حل المشكلات المستقبلية.`,
    thirdPartyPrivacyPolicies: `سياسات خصوصية الطرف الثالث`,
    thirdPartyPrivacyPoliciesContent: `لا تنطبق سياسة خصوصية نداء على المعلنين أو المواقع الإلكترونية الأخرى. وبالتالي، فإننا ننصحك بالرجوع إلى سياسات الخصوصية الخاصة بخوادم إعلانات الجهات الخارجية هذه للحصول على معلومات أكثر تفصيلا. قد يتضمن ممارساتهم وتعليماتهم حول كيفية إلغاء الاشتراك في خيارات معينة.`,
    childrensInformation: `معلومات الأطفال`,
    childrensInformationContentOne: `جزء آخر من أولويتنا هو إضافة حماية للأطفال أثناء استخدام الإنترنت. نحن نشجع الآباء وأولياء الأمور على مراقبة نشاطهم عبر الإنترنت والمشاركة فيه و/أو مراقبته وتوجيهه.`,
    childrensInformationContentTwo: `لا تجمع نداء عن علم أي معلومات تعريف شخصية من الأطفال دون سن 13 عاما. إذا كنت تعتقد أن طفلك قدم هذا النوع من المعلومات على تطبيقنا، فإننا نشجعك بشدة على الاتصال بنا على الفور وسنبذل قصارى جهدنا لإزالة هذه المعلومات على الفور من سجلاتنا.`,
    onlinePrivacyPolicyOnly: `سياسة الخصوصية عبر الإنترنت فقط`,
    onlinePrivacyPolicyOnlyContent: `تنطبق سياسة الخصوصية هذه فقط على أنشطتنا عبر الإنترنت وهي صالحة لزوار تطبيقنا فيما يتعلق بالمعلومات التي شاركواها و/أو يجمعونها في نداء. لا تنطبق هذه السياسة على أي معلومات يتم جمعها في وضع عدم الاتصال أو عبر قنوات أخرى غير هذا التطبيق. تم إنشاء سياسة الخصوصية الخاصة بنا بمساعدة`,
    onlinePrivacyPolicyOnlyContentLinkHref: `مولد سياسة خصوصية التطبيق من App-Privacy-Policy.com`,
    consent: `موافقة`,
    consentContent: `باستخدام تطبيقنا، فإنك توافق بموجب هذا على سياسة الخصوصية الخاصة بنا وتوافق على الشروط والأحكام الخاصة بها.`,
    contactUs: `تواصل معنا`,
    contactUsContent: `إذا كان لديك أي أسئلة أو اقتراحات حول سياسة الخصوصية الخاصة بنا، فلا تتردد في الاتصال بنا على`,
    policyEffectiveDate: `تسري هذه السياسة اعتبارا من 2023-01-01`,
  },
});

export default strings;
