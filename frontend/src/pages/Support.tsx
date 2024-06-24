const Support = () => {
  return (
    <div className="">
      <main className="container mx-auto px-4 flex gap-4 flex-col md:flex-row">
        <section className="bg-white rounded ">
          <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="mb-4">New to DayBreakPass? You can learn more about us here, and in case you still have any other questions, feel free to reach out to us at <a href="mailto:team@daybreakpass.com" className="text-goldColor hover:underline">team@daybreakpass.com</a></p>
          <ul className="list-disc list-inside ml-5 space-y-2">
            <li>
              <strong>If I book a DayBreakPass, am I guaranteed a pool chair?</strong>
              <p className="ml-5">Yes, hotels are notified of your booking on their DayBreakPass Dashboard as soon as it happens, and they will reserve enough pool chairs for you and your guests.</p>
            </li>
            <li>
              <strong>What is your cancellation policy?</strong>
              <p className="ml-5">Our standard cancellation policy is any DayBreakPass canceled before 10AM on the date of arrival is fully refunded. Under certain circumstances, hotels may have a different cancellation policy, so we always recommend checking the hotel's cancellation policy listed on its page.</p>
            </li>
            <li>
              <strong>Do I have to pay on-property?</strong>
              <p className="ml-5">Unless otherwise stated under a package's details, you pay the full amount online.</p>
            </li>
            <li>
              <strong>Will the hotel store my luggage?</strong>
              <p className="ml-5">If you ask at the front desk, most hotels will agree to store your luggage free of charge.</p>
            </li>
            <li>
              <strong>What time can I check-in? How late can I stay at the hotel?</strong>
              <p className="ml-5">The standard DayBreakPass hours are 10AM-6PM, though that's subject to change, so we always recommend checking the DayBreakPass hours listed on hotels' pages.</p>
            </li>
            <li>
              <strong>What do I need to check-in?</strong>
              <p className="ml-5">All you need to check-in is a valid photo ID, and your confirmation. Once you book, the hotel is immediately notified of your reservation and will be expecting you. No need to print anything as long as you can access your confirmation email.</p>
            </li>
          </ul>
        </section>
        <section className="p-6 rounded  mt-8">
          <h2 className="text-xl font-semibold mb-4">Have any other questions?</h2>
          <p>Contact us</p>
          <p><a href="mailto:team@daybreakpass.com" className="text-goldColor hover:underline">team@daybreakpass.com</a></p>
        </section>
      </main>
    </div>
  );
};

export default Support;
