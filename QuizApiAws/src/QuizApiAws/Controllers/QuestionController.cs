global using QuizApiAws.Models;
global using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql.EntityFrameworkCore.PostgreSQL;


namespace QuizApiAws.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly QuizDbContext _context;
        public QuestionController(QuizDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
        {
            var random5Qns = await (_context.Questions
                .Select(x => new
                {
                    QnId = x.QnId,
                    QnInWords = x.QnInWords,
                    ImageName = x.ImageName,
                    Options = new string[] { x.Option1, x.Option2, x.Option3, x.Option4 }
                })
            // .OrderBy(y => Guid.NewGuid())
            .Take(5)
            ).ToListAsync();

            return Ok(random5Qns);
            // return await _context.Questions.ToListAsync();
        }

        [HttpPost]
        [Route("GetAnswers")]
        public async Task<ActionResult<Question>> RetrieveAnswers(int[] qnIds)
        {
            var answers = await (_context.Questions
                .Where(y => qnIds.Contains(y.QnId))
                 .Select(x => new
                 {
                     QnId = x.QnId,
                     QnInWords = x.QnInWords,
                     ImageName = x.ImageName,
                     Options = new string[] { x.Option1, x.Option2, x.Option3, x.Option4 },
                     Answer = x.Answer
                 })
                ).ToListAsync();

            return Ok(answers);
        }

    }
}