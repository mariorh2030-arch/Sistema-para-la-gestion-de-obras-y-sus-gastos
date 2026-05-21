using Microsoft.EntityFrameworkCore;
using ApiObras.Data;

namespace ApiObras.Services
{
    public class OcultarFacturasServices : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public OcultarFacturasServices(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while(!stoppingToken.IsCancellationRequested)
            {
                var ahora = DateTime.Now;
                var proximoDia = new DateTime(ahora.Year, ahora.Month, ahora.Day).AddMonths(1);
                await Task.Delay(proximoDia - ahora, stoppingToken);

                using var scope = _scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var mesAnterior = ahora.AddMonths(-1);
                await context.Facturas
                    .Where(f => f.FechaEmision.Month == mesAnterior.Month 
                            && f.FechaEmision.Year == mesAnterior.Year)
                    .ExecuteUpdateAsync(f => f.SetProperty(x => x.activo, false));

            }
        }
    }
}