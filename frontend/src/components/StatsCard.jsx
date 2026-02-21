const StatsCard = ({ title, value, icon: Icon, gradient, trend }) => {
    return (
        <div className="card hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <p className="text-sm text-green-600 mt-1">
                            ↑ {trend}% from last month
                        </p>
                    )}
                </div>
                <div className={`w-14 h-14 rounded-full ${gradient} flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
