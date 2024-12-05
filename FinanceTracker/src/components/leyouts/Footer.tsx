import "../../css/Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h6>About</h6>
            <p className="text-justify">
              FinanceTracker.com — створений для людей, які прагнуть ефективно
              керувати своїми фінансами та отримувати повну статистику щодо
              доходів і витрат. Проєкт розроблено студентом факультету
              комп’ютерних наук Національного університету «Острозька академія».
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div>
            <p className="copyright-text">
              Copyright &copy; 2024 Всі права належать
              <a href="#"> Тарасюку Дмитру</a>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
