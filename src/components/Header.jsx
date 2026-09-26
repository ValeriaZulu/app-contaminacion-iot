function Header() {
    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="header-brand">
                    <div className="header-icon">📡</div>

                    <div>
                        <h1>Monitoreo de Ocupación del Espectro</h1>
                        <p>
                            Sistema de análisis de mediciones RF · 840–860 MHz
                        </p>
                    </div>
                </div>

                <div className="header-status">
                    <span className="status-dot"></span>
                    Sistema operativo
                </div>
            </div>
        </header>
    );
}

export default Header;