import type { AppLocale } from "@/shared/i18n/locale";
import React from "react";
import { ShieldCheck, FileText, Cookie, Scale } from "lucide-react";

export const getLegalCopy = (locale: AppLocale) => {
  const isEn = locale === "en";

  return {
    meta: {
      title: isEn ? "Legal & Policies | VietGreenX" : "Pháp lý & Chính sách | VietGreenX",
      description: isEn
        ? "Policies, terms of service, and platform regulations of the VietGreenX system."
        : "Các chính sách, điều khoản dịch vụ và quy chế hoạt động của hệ thống VietGreenX.",
    },
    hero: {
      backHome: isEn ? "Back to home" : "Về trang chủ",
      breadcrumb: isEn ? "Legal Center" : "Trung tâm pháp lý",
      titleStart: isEn ? "Legal & " : "Pháp lý & ",
      titleHighlight: isEn ? "Policies" : "Chính sách",
      description: isEn
        ? "Transparency and clarity are top priorities at VietGreenX. Here, we detail your rights, responsibilities, and how we protect your data."
        : "Minh bạch và rõ ràng là tiêu chí hàng đầu của VietGreenX. Tại đây, chúng tôi quy định chi tiết về quyền lợi, trách nhiệm và cách thức bảo vệ dữ liệu của bạn.",
    },
    sidebar: {
      category: isEn ? "Category" : "Danh mục",
      supportHint: isEn
        ? "Have questions about our policies? Our support team is always ready."
        : "Bạn có thắc mắc về các chính sách? Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng.",
      supportLink: isEn ? "Contact Support" : "Liên hệ hỗ trợ",
    },
    navItems: [
      { id: "terms", icon: FileText, label: isEn ? "Terms of Service" : "Điều khoản dịch vụ" },
      { id: "privacy", icon: ShieldCheck, label: isEn ? "Privacy Policy" : "Chính sách bảo mật" },
      { id: "cookie", icon: Cookie, label: isEn ? "Cookie Policy" : "Chính sách Cookie" },
      {
        id: "regulation",
        icon: Scale,
        label: isEn ? "Platform Regulations" : "Quy chế hoạt động sàn",
      },
    ],
    content: {
      terms: (
        <>
          <div className="mb-8 border-b border-border pb-6">
            <h2 className="mb-2 text-3xl font-bold text-foreground">
              {isEn ? "Terms of Service" : "Điều khoản dịch vụ"}
            </h2>
            <p className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
              {isEn ? "Effective from: 15/07/2026" : "Có hiệu lực từ: 15/07/2026"}
            </p>
          </div>
          <div className="space-y-10 text-[15px] leading-relaxed">
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  1
                </span>
                {isEn ? "General Introduction" : "Giới thiệu chung"}
              </h3>
              <p>
                {isEn
                  ? 'Thank you for using the VietGreenX agricultural traceability and e-commerce platform. By accessing or using our website, mobile app, or other services (collectively the "Services"), you agree to be bound by these Terms of Service.'
                  : 'Cảm ơn bạn đã sử dụng nền tảng truy xuất nguồn gốc và thương mại điện tử nông sản VietGreenX. Bằng việc truy cập hoặc sử dụng trang web, ứng dụng di động, hoặc các dịch vụ khác của chúng tôi (gọi chung là "Dịch vụ"), bạn đồng ý bị ràng buộc bởi các Điều khoản dịch vụ này.'}
              </p>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  2
                </span>
                {isEn ? "Rights and Obligations" : "Quyền và nghĩa vụ"}
              </h3>
              <div className="rounded-xl border border-border bg-muted/50 p-5">
                <ul className="m-0 list-disc space-y-3 pl-5">
                  <li>
                    <strong>{isEn ? "Authentication:" : "Thông tin xác thực:"}</strong>{" "}
                    {isEn
                      ? "You must provide accurate, complete, and updated information when registering."
                      : "Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký tài khoản hệ thống."}
                  </li>
                  <li>
                    <strong>{isEn ? "Security:" : "Bảo mật:"}</strong>{" "}
                    {isEn
                      ? "You are responsible for keeping your login credentials confidential."
                      : "Bạn chịu trách nhiệm bảo mật tuyệt đối thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình."}
                  </li>
                  <li>
                    <strong>{isEn ? "Prohibited Conduct:" : "Hành vi cấm:"}</strong>{" "}
                    {isEn
                      ? "It is strictly prohibited to use the platform to post false origin information, counterfeits, or engage in fraudulent activities."
                      : "Nghiêm cấm việc sử dụng nền tảng để đăng tải thông tin sai lệch về nguồn gốc nông sản, hàng giả, hàng nhái, hoặc các hành vi lừa đảo người tiêu dùng."}
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  3
                </span>
                {isEn ? "Traceability Regulations" : "Quy định truy xuất nguồn gốc"}
              </h3>
              <p>
                {isEn
                  ? "All batches and products submitted to the system to receive a traceability QR code must strictly comply with the field log declaration procedures set by the administration. VietGreenX reserves the right to refuse to issue codes or remove products showing signs of fraud or falsified traceability data without prior notice."
                  : "Mọi lô hàng và sản phẩm được đưa lên hệ thống để cấp mã QR truy xuất đều phải tuân thủ nghiêm ngặt các quy trình khai báo nhật ký đồng ruộng do ban quản trị đặt ra. VietGreenX có quyền từ chối cấp mã hoặc gỡ bỏ các sản phẩm có dấu hiệu gian lận, làm giả dữ liệu truy xuất mà không cần báo trước."}
              </p>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  4
                </span>
                {isEn ? "Marketplace Exchange" : "Sàn giao dịch Marketplace"}
              </h3>
              <p>
                {isEn
                  ? "The VietGreenX e-commerce platform aims to connect producers directly with buyers, eliminating intermediaries. We provide technology infrastructure and traceability tools. Any disputes arising from transactions, product quality, or payments will be resolved based on the Dispute Resolution Policy."
                  : "Sàn thương mại điện tử VietGreenX hoạt động với mục đích kết nối nhà sản xuất trực tiếp đến người mua, lược bỏ các khâu trung gian. Chúng tôi cung cấp hạ tầng công nghệ và công cụ truy xuất. Mọi tranh chấp phát sinh từ giao dịch mua bán, chất lượng sản phẩm thực tế, hoặc thanh toán sẽ được giải quyết dựa trên Chính sách giải quyết tranh chấp."}
              </p>
            </section>
          </div>
        </>
      ),
      privacy: (
        <>
          <div className="mb-8 border-b border-border pb-6">
            <h2 className="mb-2 text-3xl font-bold text-foreground">
              {isEn ? "Privacy Policy" : "Chính sách bảo mật"}
            </h2>
            <p className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
              {isEn ? "Effective from: 15/07/2026" : "Có hiệu lực từ: 15/07/2026"}
            </p>
          </div>
          <div className="space-y-10 text-[15px] leading-relaxed">
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  1
                </span>
                {isEn ? "Data Collection" : "Thu thập thông tin"}
              </h3>
              <p>
                {isEn
                  ? "We collect basic personal information such as name, phone number, email address, and geographic location when you register."
                  : "Chúng tôi thu thập thông tin cá nhân cơ bản như họ tên, số điện thoại, địa chỉ email, và vị trí địa lý của bạn khi bạn đăng ký tài khoản."}
              </p>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  2
                </span>
                {isEn ? "Information Usage" : "Sử dụng thông tin"}
              </h3>
              <div className="rounded-xl border border-border bg-muted/50 p-5">
                <ul className="m-0 list-disc space-y-3 pl-5">
                  <li>
                    {isEn
                      ? "Authenticate users and producers."
                      : "Xác thực tài khoản người dùng và nhà sản xuất."}
                  </li>
                  <li>
                    {isEn
                      ? "Support safe transactions on the Marketplace."
                      : "Hỗ trợ thực hiện các giao dịch trên Marketplace một cách an toàn."}
                  </li>
                  <li>
                    {isEn
                      ? "Contact you with important notifications or technical support."
                      : "Liên lạc với bạn khi có thông báo quan trọng hoặc khi cần hỗ trợ kỹ thuật."}
                  </li>
                  <li>
                    {isEn
                      ? "Analyze anonymous data to improve user experience."
                      : "Phân tích dữ liệu ẩn danh để cải thiện trải nghiệm người dùng và chất lượng nền tảng."}
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  3
                </span>
                {isEn ? "Data Sharing" : "Chia sẻ dữ liệu"}
              </h3>
              <p>
                {isEn
                  ? "We commit not to sell your personal data to any third party for commercial advertising. Your data is only shared minimally with shipping and payment partners when actual orders arise."
                  : "Chúng tôi cam kết không bán dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo thương mại. Dữ liệu của bạn chỉ được chia sẻ một cách hạn chế cho các đối tác vận chuyển và thanh toán khi có phát sinh đơn hàng thực tế trên sàn."}
              </p>
            </section>
          </div>
        </>
      ),
      cookie: (
        <>
          <div className="mb-8 border-b border-border pb-6">
            <h2 className="mb-2 text-3xl font-bold text-foreground">
              {isEn ? "Cookie Policy" : "Chính sách Cookie"}
            </h2>
            <p className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
              {isEn ? "Effective from: 15/07/2026" : "Có hiệu lực từ: 15/07/2026"}
            </p>
          </div>
          <div className="space-y-10 text-[15px] leading-relaxed">
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  1
                </span>
                {isEn ? "What are Cookies?" : "Cookie là gì?"}
              </h3>
              <p>
                {isEn
                  ? "Cookies are small text files downloaded to your device when you visit websites. They allow websites to remember your actions or preferences."
                  : "Cookie là các tệp văn bản nhỏ được tải xuống thiết bị của bạn khi truy cập các trang web. Chúng cho phép trang web ghi nhớ hành động hoặc sở thích của bạn."}
              </p>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  2
                </span>
                {isEn ? "How we use them" : "Cách chúng tôi sử dụng"}
              </h3>
              <p>
                {isEn
                  ? "We use Cookies for essential purposes so the VietGreenX platform can function normally, specifically:"
                  : "Chúng tôi sử dụng Cookie cho các mục đích thiết yếu để nền tảng VietGreenX có thể hoạt động bình thường, cụ thể như:"}
              </p>
              <div className="mt-4 rounded-xl border border-border bg-muted/50 p-5">
                <ul className="m-0 list-disc space-y-3 pl-5">
                  <li>
                    {isEn
                      ? "Maintain user login sessions."
                      : "Duy trì phiên đăng nhập của người dùng."}
                  </li>
                  <li>
                    {isEn
                      ? "Remember your language and interface preferences."
                      : "Ghi nhớ các tùy chọn giao diện và ngôn ngữ của bạn."}
                  </li>
                  <li>
                    {isEn
                      ? "Analyze overall traffic to optimize server performance."
                      : "Phân tích lưu lượng truy cập tổng thể để tối ưu hóa hiệu năng máy chủ."}
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  3
                </span>
                {isEn ? "Managing Your Cookies" : "Quản lý Cookie của bạn"}
              </h3>
              <p>
                {isEn
                  ? "You can completely control and delete cookies through your web browser settings. However, please note that if you disable essential cookies, some platform features (like logging in or shopping cart) may not work correctly."
                  : "Bạn hoàn toàn có thể kiểm soát và xóa cookie thông qua phần cài đặt của trình duyệt web đang sử dụng. Tuy nhiên, xin lưu ý rằng nếu bạn vô hiệu hóa cookie thiết yếu, một số tính năng của nền tảng (như đăng nhập, giỏ hàng) có thể không hoạt động chính xác."}
              </p>
            </section>
          </div>
        </>
      ),
      regulation: (
        <>
          <div className="mb-8 border-b border-border pb-6">
            <h2 className="mb-2 text-3xl font-bold text-foreground">
              {isEn ? "Platform Regulations" : "Quy chế hoạt động sàn"}
            </h2>
            <p className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
              {isEn ? "Effective from: 15/07/2026" : "Có hiệu lực từ: 15/07/2026"}
            </p>
          </div>
          <div className="space-y-10 text-[15px] leading-relaxed">
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  1
                </span>
                {isEn ? "General Principles" : "Nguyên tắc chung"}
              </h3>
              <p>
                {isEn
                  ? "VietGreenX operates based on freedom of agreement, equality, and respect for the law. All trading activities must be public, transparent, and protect consumer rights."
                  : "Sàn giao dịch VietGreenX hoạt động theo nguyên tắc tự do thỏa thuận, bình đẳng và tôn trọng pháp luật. Mọi hoạt động mua bán phải minh bạch và bảo vệ quyền lợi người tiêu dùng."}
              </p>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  2
                </span>
                {isEn
                  ? "For Sellers (Producers/Co-ops)"
                  : "Đối với người bán (Nhà sản xuất/Hợp tác xã)"}
              </h3>
              <div className="rounded-xl border border-border bg-muted/50 p-5">
                <ul className="m-0 list-disc space-y-3 pl-5">
                  <li>
                    {isEn
                      ? "Must ensure 100% accuracy regarding agricultural origin information."
                      : "Phải đảm bảo tính chính xác 100% về thông tin nguồn gốc xuất xứ của nông sản."}
                  </li>
                  <li>
                    {isEn
                      ? "The quality of the product delivered to the customer must match the description and information declared on the traceability system."
                      : "Chất lượng sản phẩm giao cho khách hàng phải đúng như mô tả và thông tin đã khai báo trên hệ thống truy xuất."}
                  </li>
                  <li>
                    {isEn
                      ? "Coordinate to quickly resolve customer complaints and feedback about product quality."
                      : "Phối hợp giải quyết nhanh chóng các khiếu nại, phản hồi từ người mua về chất lượng hàng hóa."}
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  3
                </span>
                {isEn ? "For Buyers" : "Đối với người mua"}
              </h3>
              <p>
                {isEn
                  ? "Carefully read product descriptions and check the QR Code traceability stamp (if applicable) before deciding to purchase. Buyers are responsible for paying fully and on time for ordered items according to the agreed method."
                  : "Cần đọc kỹ mô tả sản phẩm, kiểm tra tem truy xuất nguồn gốc QR Code (nếu có) trước khi quyết định đặt mua. Người mua có trách nhiệm thanh toán đầy đủ và đúng hạn cho các đơn hàng đã đặt theo phương thức thỏa thuận."}
              </p>
            </section>

            <section>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  4
                </span>
                {isEn ? "Handling Violations" : "Xử lý vi phạm"}
              </h3>
              <p>
                {isEn
                  ? "VietGreenX will apply actions ranging from warnings, temporary account suspensions, to permanent bans for: selling counterfeit goods, posting distorted information, fraudulent orders, or scamming on the platform."
                  : "VietGreenX sẽ áp dụng các hình thức xử lý từ cảnh cáo, tạm khóa tài khoản đến khóa vĩnh viễn đối với các hành vi: bán hàng giả mạo, đăng tải thông tin xuyên tạc, bom hàng, lừa đảo chiếm đoạt tài sản trên nền tảng."}
              </p>
            </section>
          </div>
        </>
      ),
    } as Record<string, React.ReactNode>,
  };
};
