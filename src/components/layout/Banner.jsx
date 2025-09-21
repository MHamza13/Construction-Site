import React from "react";

const Banner = ({ title, subtitle, breadcrumb }) => {
  return (
    <div className="text-dark ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Title + Subtitle */}
        <div>
          {title && (
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          )}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>

        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mt-3 md:mt-0" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumb.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:underline text-gray-600"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-dark font-medium">{item.label}</span>
                  )}
                  {index < breadcrumb.length - 1 && <span>/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Banner;
